const esbuild = require('esbuild');
const path = require('path');

async function build() {
  const production = process.argv.includes('--production');
  
  await esbuild.build({
    entryPoints: [path.resolve(__dirname, 'src/extension.ts')],
    bundle: true,
    outfile: path.resolve(__dirname, 'dist/extension.js'),
    platform: 'node',
    target: 'node20',
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    external: ['vscode'],
    logLevel: 'info',
  });
  
  console.log('Build completed:', production ? 'production' : 'development');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
