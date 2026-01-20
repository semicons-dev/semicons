import noHardcodedSvgImport from './rules/no-hardcoded-svg-import.js';
import noImgRawSvg from './rules/no-img-raw-svg.js';
import validIconToken from './rules/valid-icon-token.js';

const rules = {
  'no-hardcoded-svg-import': noHardcodedSvgImport,
  'no-img-raw-svg': noImgRawSvg,
  'valid-icon-token': validIconToken,
};

const configs = {
  recommended: {
    plugins: {
      '@semicons': { rules },
    },
    rules: {
      '@semicons/no-hardcoded-svg-import': 'error',
      '@semicons/no-img-raw-svg': 'warn',
      '@semicons/valid-icon-token': ['error', { registryPath: 'src/icons.generated/registry.json' }],
    },
  },
};

const plugin = {
  meta: {
    name: '@semicons/eslint-plugin',
    version: '0.0.1',
  },
  rules,
  configs,
};

export default plugin;
