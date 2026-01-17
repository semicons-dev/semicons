import { describe } from 'vitest';
import { RuleTester } from 'eslint';
import * as parser from '@typescript-eslint/parser';
import rule, { RULE_NAME } from '../valid-icon-token';

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
        code: '<Icon name="navigation:menu" />',
        options: [{ iconComponentName: 'Icon', iconNameProp: 'name' }],
      },
      {
        code: '<Icon name="action:edit" />',
        options: [{ iconComponentName: 'Icon', iconNameProp: 'name' }],
      },
    ],
    invalid: [
      {
        code: '<Icon name="InvalidToken" />',
        errors: [{ messageId: 'invalidFormat' }],
      },
      {
        code: '<Icon name="invalid" />',
        errors: [{ messageId: 'invalidFormat' }],
      },
    ],
  });
});
