import { describe } from 'vitest';
import { RuleTester } from 'eslint';
import * as parser from '@typescript-eslint/parser';
import rule, { RULE_NAME } from '../no-img-raw-svg';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

describe(RULE_NAME, () => {
  ruleTester.run(RULE_NAME, rule, {
    valid: [
      {
        code: '<img src="image.png" />',
      },
      {
        code: '<img src="image.jpg" />',
      },
    ],
    invalid: [
      {
        code: '<img src="icon.svg" />',
        errors: [{ messageId: 'message' }],
      },
      {
        code: '<img src="/path/to/icon.svg" />',
        errors: [{ messageId: 'message' }],
      },
    ],
  });
});
