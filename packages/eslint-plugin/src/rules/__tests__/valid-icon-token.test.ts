import { describe, it, expect } from 'vitest';
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
      {
        code: '<Icon name="status:success" />',
        options: [{ iconComponentName: 'Icon', iconNameProp: 'name' }],
      },
      {
        code: '<CustomIcon name="navigation:menu" />',
        options: [{ iconComponentName: 'CustomIcon', iconNameProp: 'name' }],
      },
      {
        code: '<Icon icon="navigation:menu" />',
        options: [{ iconComponentName: 'Icon', iconNameProp: 'icon' }],
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
      {
        code: '<Icon name="123:abc" />',
        errors: [{ messageId: 'invalidFormat' }],
      },
      {
        code: '<Icon name="NoColons" />',
        errors: [{ messageId: 'invalidFormat' }],
      },
      {
        code: '<CustomIcon name="invalid" />',
        options: [{ iconComponentName: 'CustomIcon', iconNameProp: 'name' }],
        errors: [{ messageId: 'invalidFormat' }],
      },
      {
        code: '<Icon icon="invalid" />',
        options: [{ iconComponentName: 'Icon', iconNameProp: 'icon' }],
        errors: [{ messageId: 'invalidFormat' }],
      },
      {
        code: '<Icon name=":starts-with-colon" />',
        errors: [{ messageId: 'invalidFormat' }],
      },
      {
        code: '<Icon name="ends-with-colon:" />',
        errors: [{ messageId: 'invalidFormat' }],
      },
      {
        code: '<Icon name="double::colon" />',
        errors: [{ messageId: 'invalidFormat' }],
      },
    ],
  });

  it('should have fixable code property', () => {
    expect(rule.meta?.fixable).toBe('code');
  });

  it('should have hasSuggestions enabled', () => {
    expect(rule.meta?.hasSuggestions).toBe(true);
  });
});
