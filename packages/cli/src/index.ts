import { Command } from 'commander';
import { loadConfig } from './lib/config-loader.js';
import {
  toRegistryJSON,
  toRegistrySchema,
  filterLocalTokens,
  extractLocalId,
  isLocalAssetRef
} from '@semicons/core';
import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import { optimize } from 'svgo';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface GenerateOptions {
  config?: string;
  out?: string;
  noOptimize?: boolean;
  strict?: boolean;
}

interface ScanOptions {
  dir?: string;
  config?: string;
  format?: string;
  failOn?: string;
}

interface InitOptions {
  dir?: string;
  themes?: string;
  yes?: boolean;
}

interface DoctorOptions {
  fix?: boolean;
  strict?: boolean;
}

export function run() {
  const program = new Command();

  program
    .name('semicons')
    .description('Semicons CLI - Icon system management')
    .version('0.0.0');

  program
    .command('init')
    .description('Initialize semicons configuration')
    .option('-d, --dir <path>', 'target directory', '.')
    .option('--themes <themes>', 'comma-separated themes', 'light,dark')
    .option('-y, --yes', 'skip prompts', false)
    .action(async (options: InitOptions) => {
      await cmdInit(options);
    });

  program
    .command('generate')
    .description('Generate icons from configuration')
    .option('-c, --config <path>', 'config file path')
    .option('-o, --out <dir>', 'output directory', 'src/icons.generated')
    .option('--no-optimize', 'skip svgo optimization', false)
    .option('--strict', 'enforce theme completeness', false)
    .action(async (options: GenerateOptions) => {
      await cmdGenerate(options);
    });

  program
    .command('scan [path]')
    .description('Scan directory for icon usage')
    .option('-d, --dir <path>', 'directory to scan', '.')
    .option('-c, --config <path>', 'config file path')
    .option('-f, --format <text|json|html>', 'output format', 'text')
    .option('--fail-on <error|warn|never>', 'exit condition', 'error')
    .action(async (options: ScanOptions) => {
      await cmdScan(options);
    });

  program
    .command('doctor')
    .description('Check semicons installation')
    .option('--fix', 'attempt automatic fixes', false)
    .option('--strict', 'treat warnings as errors', false)
    .action(async (options: DoctorOptions) => {
      await cmdDoctor(options);
    });

  program.parse();
}

async function cmdInit(options: InitOptions) {
  const targetDir = path.resolve(options.dir || '.');
  console.log(`[init] Initializing semicons in ${targetDir}`);

  const themes = options.themes?.split(',').map(t => t.trim()) || ['light', 'dark'];
  const configContent = `export default {
  version: '1.0.0',
  themes: ${JSON.stringify(themes)},
  defaultTheme: '${themes.includes('light') ? 'light' : themes[0]}',
  tokens: {
    'status:info': 'local:info',
    'status:success': 'local:success',
    'status:warning': 'local:warning',
    'status:error': 'local:error'
  }
};
`;

  const configPath = path.join(targetDir, 'semicons.config.mjs');
  await fs.writeFile(configPath, configContent);
  console.log(`[init] Created ${configPath}`);

  const iconsDir = path.join(targetDir, 'icons', 'local');
  await fs.mkdir(iconsDir, { recursive: true });

  const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="10"/>
</svg>`;

  for (const name of ['info', 'success', 'warning', 'error']) {
    await fs.writeFile(path.join(iconsDir, `${name}.svg`), sampleSvg);
  }
  console.log(`[init] Created ${iconsDir}`);

  const outDir = path.join(targetDir, 'src', 'icons.generated');
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, '.gitkeep'), '');
  console.log(`[init] Created ${outDir}`);

  const gitignorePath = path.join(targetDir, '.gitignore');
  let gitignore = '';
  try {
    gitignore = await fs.readFile(gitignorePath, 'utf-8');
  } catch {}
  if (!gitignore.includes('icons.generated')) {
    gitignore += '\n# Semicons\nsrc/icons.generated/\n';
    await fs.writeFile(gitignorePath, gitignore);
    console.log(`[init] Updated .gitignore`);
  }

  console.log('[init] Done! Run "pnpm semicons generate" to generate icons.');
}

async function cmdGenerate(options: GenerateOptions) {
  console.log('[generate] Loading configuration...');
  let configPath = options.config;

  if (!configPath) {
    const searchPaths = ['semicons.config.mjs', 'semicons.config.js', 'semicons.config.json'];
    for (const sp of searchPaths) {
      if (await fs.access(sp).then(() => true).catch(() => false)) {
        configPath = sp;
        break;
      }
    }
  }

  if (!configPath) {
    throw new Error('No config file found. Use --config or create semicons.config.mjs');
  }

  const normalizeOptions: { onWarning?: (w: any) => void } = {};
  const warnings: any[] = [];

  if (options.strict) {
    normalizeOptions.onWarning = (warning) => {
      warnings.push(warning);
    };
  }

  const { registry, filepath } = await loadConfig(configPath, normalizeOptions);
  const configDir = path.dirname(filepath);
  const outDir = path.resolve(options.out || 'src/icons.generated');
  await fs.mkdir(outDir, { recursive: true });

  console.log(`[generate] Generating ${registry.tokens.length} tokens to ${outDir}`);

  const registryJson = toRegistryJSON(registry);
  await fs.writeFile(path.join(outDir, 'registry.json'), JSON.stringify(registryJson, null, 2));

  const schemaJson = toRegistrySchema();
  await fs.writeFile(path.join(outDir, 'schema.json'), JSON.stringify(schemaJson, null, 2));

  const tokenNames = registry.tokens.map(t => t.name);
  const typesContent = `// Auto-generated by semicons
export type IconName = ${tokenNames.map(n => `'${n}'`).join(' | ')};

export interface IconMeta {
  name: string;
  category?: string;
  deprecated?: boolean | string;
  description?: string;
}

export const ICON_META: Record<IconName, IconMeta> = {
${registry.tokens.map(t => `  '${t.name}': {
    name: '${t.name}',
    ${t.meta.category ? `category: '${t.meta.category}',` : ''}
    ${t.deprecated ? `deprecated: ${typeof t.deprecated === 'string' ? `'${t.deprecated}'` : 'true'},` : ''}
    ${t.meta.description ? `description: '${t.meta.description}',` : ''}
  }`).join(',\n')}
};
`;
  await fs.writeFile(path.join(outDir, 'types.ts'), typesContent);

  const localTokens = filterLocalTokens(registry.tokens);

  const inlineIcons: Record<string, { svg: string; viewBox?: string }> = {};
  const spriteSymbols: string[] = [];

  if (localTokens.length > 0) {
    const iconsLocalDir = path.join(outDir, 'local');
    await fs.mkdir(iconsLocalDir, { recursive: true });

    for (const token of localTokens) {
      for (const [theme, assetRef] of Object.entries(token.themes)) {
        const svgId = extractLocalId(assetRef);
        if (svgId === null) continue;

        const svgPath = path.resolve(configDir, 'icons', 'local', `${svgId}.svg`);
        try {
          let svgContent = await fs.readFile(svgPath, 'utf-8');
          if (!options.noOptimize) {
            const result = optimize(svgContent, { path: svgPath, plugins: [] });
            svgContent = result.data;
          }
          const outPath = path.join(iconsLocalDir, `${token.name.replace(/:/g, '-')}.${theme}.svg`);
          await fs.writeFile(outPath, svgContent);

          const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/);
          const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

          const inlineKey = `${token.name}:${theme}`;
          inlineIcons[inlineKey] = { svg: svgContent, viewBox };

          const symbolId = `${token.name.replace(/:/g, '-')}-${theme}`;
          const symbolContent = svgContent
            .replace(/<svg[^>]*>/, '')
            .replace(/<\/svg>/, '');
          spriteSymbols.push(`<symbol id="${symbolId}" viewBox="${viewBox}">${symbolContent}</symbol>`);
        } catch (e) {
          console.warn(`[generate] Warning: Could not read ${assetRef}`);
        }
      }
    }
  }

  const inlineContent = `// Auto-generated by semicons
export interface InlineIconData {
  svg: string;
  viewBox?: string;
}

export const INLINE_ICONS: Record<string, InlineIconData> = ${JSON.stringify(inlineIcons, null, 2)};
`;
  await fs.writeFile(path.join(outDir, 'inline.ts'), inlineContent);

  const spriteContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
${spriteSymbols.join('\n')}
</svg>
`;
  await fs.writeFile(path.join('public', 'semicons.svg'), spriteContent);

  const report = {
    version: registry.version,
    tokenCount: registry.tokens.length,
    themeCount: registry.themes.length,
    generatedAt: new Date().toISOString(),
    warnings
  };
  await fs.writeFile(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));

  if (warnings.length > 0) {
    console.log('[generate] Warnings:');
    for (const w of warnings) {
      console.log(`  [${w.code}] ${w.message} (${w.fieldPath})`);
    }

    if (options.strict) {
      console.log('[generate] Error: Strict mode enabled, exiting due to warnings');
      process.exit(1);
    }
  }

  console.log('[generate] Done!');
}

async function cmdScan(options: ScanOptions) {
  const scanDir = path.resolve(options.dir || '.');
  console.log(`[scan] Scanning ${scanDir}...`);

  const { registry } = await loadConfig(options.config);
  const violations: Array<{ file: string; line: number; code: string; message: string; level: string }> = [];

  const files = await glob('**/*.{ts,tsx,js,jsx}', { cwd: scanDir });

  for (const file of files) {
    const content = await fs.readFile(path.join(scanDir, file), 'utf-8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      if (line.includes('.svg')) {
        if (line.includes('import') && line.includes('.svg')) {
          violations.push({
            file,
            line: lineNum,
            code: 'SVG_IMPORT',
            message: 'Direct .svg import detected',
            level: 'error'
          });
        } else if (line.includes('<img') && line.includes('.svg')) {
          violations.push({
            file,
            line: lineNum,
            code: 'SVG_IMG',
            message: '<img> with .svg src detected',
            level: 'warn'
          });
        }
      }

      const iconMatch = line.match(/name\s*=\s*["']([^"']+)["']/);
      if (iconMatch) {
        const tokenName = iconMatch[1];
        const validTokens = registry.tokens.map(t => t.name);
        if (!validTokens.includes(tokenName)) {
          violations.push({
            file,
            line: lineNum,
            code: 'UNKNOWN_TOKEN',
            message: `Unknown token "${tokenName}"`,
            level: registry.rules.allowUnknownTokens ? 'warn' : 'error'
          });
        }
        const token = registry.tokens.find(t => t.name === tokenName);
        if (token?.deprecated) {
          violations.push({
            file,
            line: lineNum,
            code: 'DEPRECATED_TOKEN',
            message: `Token "${tokenName}" is deprecated`,
            level: 'warn'
          });
        }
      }
    }
  }

  if (options.format === 'json') {
    console.log(JSON.stringify({ violations, summary: { total: violations.length } }, null, 2));
  } else {
    console.table(violations);
    console.log(`[scan] Found ${violations.length} violations`);
  }

  await fs.writeFile(path.join(scanDir, 'scan-report.json'), JSON.stringify({
    scannedAt: new Date().toISOString(),
    violations,
    summary: { total: violations.length }
  }, null, 2));

  const hasErrors = violations.some(v => v.level === 'error');
  const hasWarnings = violations.some(v => v.level === 'warn');

  const shouldFail = (options.failOn === 'error' && hasErrors) ||
                     (options.failOn === 'warn' && (hasErrors || hasWarnings));

  if (shouldFail) {
    const failType = hasErrors ? 'errors' : 'warnings';
    console.log(`[scan] Failed due to ${failType}`);
    process.exit(1);
  }
}

async function cmdDoctor(options: DoctorOptions) {
  console.log('[doctor] Running diagnostics...');
  const issues: Array<{ code: string; message: string; fix?: string }> = [];

  const configPaths = ['semicons.config.mjs', 'semicons.config.js', 'semicons.config.json'];
  let configPath: string | null = null;
  for (const p of configPaths) {
    if (await fs.access(p).then(() => true).catch(() => false)) {
      configPath = p;
      break;
    }
  }

  if (!configPath) {
    issues.push({ code: 'NO_CONFIG', message: 'No config file found' });
  } else {
    try {
      const { registry, warnings, filepath } = await loadConfig(configPath);
      const configDir = path.dirname(filepath);

      if (!registry.themes.includes(registry.defaultTheme)) {
        issues.push({
          code: 'DEFAULT_THEME_MISSING',
          message: `defaultTheme "${registry.defaultTheme}" not in themes`,
          fix: `Update defaultTheme to one of: ${registry.themes.join(', ')}`
        });
      }

      const localTokens = filterLocalTokens(registry.tokens);
      for (const token of localTokens) {
        for (const assetRef of Object.values(token.themes)) {
          if (!isLocalAssetRef(assetRef)) continue;

          const svgId = extractLocalId(assetRef);
          if (!svgId) continue;

          const svgPath = path.resolve(configDir, 'icons', 'local', `${svgId}.svg`);
          if (!(await fs.access(svgPath).then(() => true).catch(() => false))) {
            issues.push({
              code: 'MISSING_SVG',
              message: `Missing SVG file: ${svgPath}`
            });
          }
        }
      }

      if (warnings.length > 0 && options.strict) {
        issues.push({
          code: 'WARNINGS_STRICT',
          message: `${warnings.length} warnings found (treated as errors in strict mode)`
        });
      }
    } catch (e) {
      issues.push({ code: 'CONFIG_ERROR', message: `Config error: ${(e as Error).message}` });
    }
  }

  const gitignorePath = '.gitignore';
  try {
    const gitignore = await fs.readFile(gitignorePath, 'utf-8');
    if (!gitignore.includes('icons.generated')) {
      issues.push({
        code: 'GITIGNORE_MISSING',
        message: 'src/icons.generated/ not in .gitignore',
        fix: 'Add "src/icons.generated/" to .gitignore'
      });
    }
  } catch {}

  if (options.fix) {
    console.log('[doctor] Applying fixes...');
    for (const issue of issues) {
      if (issue.code === 'GITIGNORE_MISSING') {
        try {
          let gitignore = await fs.readFile('.gitignore', 'utf-8');
          if (!gitignore.includes('icons.generated')) {
            gitignore += '\n# Semicons\nsrc/icons.generated/\n';
            await fs.writeFile('.gitignore', gitignore);
            console.log(`[doctor] Fixed: ${issue.message}`);
          }
        } catch {}
      }
    }
  }

  if (issues.length === 0) {
    console.log('[doctor] All checks passed!');
  } else {
    console.table(issues);
  }
}
