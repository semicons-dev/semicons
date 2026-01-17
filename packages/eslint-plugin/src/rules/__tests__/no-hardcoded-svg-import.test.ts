import { describe } from 'vitest';
import { RuleTester } from 'eslint';
import * as parser from '@typescript-eslint/parser';
import rule, { RULE_NAME } from '../no-hardcoded-svg-import';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
});

describe(RULE_NAME, () => {
  ruleTester.run(RULE_NAME, rule, {
    valid: [
      {
        code: "import Icon from './Icon'",
      },
      {
        code: "const icon = require('./icon.png')",
      },
    ],
    invalid: [
      {
        code: "import icon from './icon.svg'",
        errors: [{ messageId: 'message' }],
      },
      {
        code: "const icon = require('./icon.svg')",
        errors: [{ messageId: 'message' }],
      },
    ],
  });
});
