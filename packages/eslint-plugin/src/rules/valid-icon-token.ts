import { Rule } from 'eslint';
import * as fs from 'fs';
import * as path from 'path';

export const RULE_NAME = 'valid-icon-token';

const TOKEN_NAME_PATTERN = /^[a-z][a-z0-9-]*:[a-zA-Z0-9][a-zA-Z0-9._/-]*$/;
const DEFAULT_REGISTRY_PATH = 'src/icons.generated/registry.json';

interface RuleOptions {
  iconComponentName?: string;
  iconNameProp?: string;
  registryPath?: string;
}

interface RegistryToken {
  name: string;
  deprecated?: boolean | string;
  meta?: {
    description?: string;
    tags?: string[];
    category?: string;
  };
  a11y?: {
    label?: string;
  };
}

interface Registry {
  version: string;
  themes: string[];
  defaultTheme: string;
  tokens: RegistryToken[];
}

function findRegistryFile(startDir: string): string | null {
  let currentDir = startDir;
  const maxDepth = 10;
  let depth = 0;

  while (currentDir && depth < maxDepth) {
    const registryPath = path.join(currentDir, DEFAULT_REGISTRY_PATH);
    try {
      if (fs.existsSync(registryPath)) {
        return registryPath;
      }
    } catch {
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
    depth++;
  }

  return null;
}

function loadRegistry(filePath: string): Registry | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Registry;
  } catch {
    return null;
  }
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Validate Icon component token names against pattern and registry.',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          iconComponentName: { type: 'string' },
          iconNameProp: { type: 'string' },
          registryPath: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidFormat: 'Icon token "{{name}}" does not match the expected pattern (category:name).',
      notInRegistry: 'Icon token "{{name}}" is not defined in the registry.',
      deprecated: 'Icon token "{{name}}" is deprecated{{replacement}}.',
    },
  },
  create(context) {
    const options: RuleOptions = context.options[0] || {};
    const iconComponentName = options.iconComponentName || 'Icon';
    const iconNameProp = options.iconNameProp || 'name';
    let registry: Registry | null = null;
    let registryLoadAttempted = false;

    function getRegistry(): Registry | null {
      if (registryLoadAttempted) {
        return registry;
      }
      registryLoadAttempted = true;

      if (options.registryPath) {
        const explicitPath = path.resolve(context.getFilename(), '..', options.registryPath);
        registry = loadRegistry(explicitPath);
        return registry;
      }

      const startDir = path.dirname(context.getFilename());
      const registryPath = findRegistryFile(startDir);
      if (registryPath) {
        registry = loadRegistry(registryPath);
      }

      return registry;
    }

    function checkToken(tokenName: string, node: Rule.Node): void {
      if (!TOKEN_NAME_PATTERN.test(tokenName)) {
        context.report({
          node,
          messageId: 'invalidFormat',
          data: { name: tokenName },
        });
        return;
      }

      const loadedRegistry = getRegistry();
      if (loadedRegistry) {
        const token = loadedRegistry.tokens.find(t => t.name === tokenName);
        if (!token) {
          context.report({
            node,
            messageId: 'notInRegistry',
            data: { name: tokenName },
          });
        } else if (token.deprecated) {
          const replacement = typeof token.deprecated === 'string' ? ` (removed in ${token.deprecated})` : '';
          context.report({
            node,
            messageId: 'deprecated',
            data: { name: tokenName, replacement },
          });
        }
      }
    }

    function checkNode(node: any): void {
      if (
        node.name?.type === 'JSXIdentifier' &&
        node.name.name === iconComponentName
      ) {
        const nameAttr = node.attributes?.find(
          (attr: any) =>
            attr.type === 'JSXAttribute' &&
            (attr.name?.type === 'JSXIdentifier' || attr.name?.type === 'Identifier') &&
            attr.name.name === iconNameProp &&
            attr.value?.type === 'Literal'
        );

        if (nameAttr && typeof nameAttr.value?.value === 'string') {
          checkToken(nameAttr.value.value, nameAttr.value);
        }
      }
    }

    return {
      JSXOpeningElement: checkNode,
      JSXSelfClosingElement: checkNode,
    };
  },
};

export default rule;
