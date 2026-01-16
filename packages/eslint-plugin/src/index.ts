import type { Rule } from 'eslint';

export const rules: Record<string, Rule.RuleModule> = {
  'icon-name-format': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce icon name format',
        category: 'Best Practices',
        recommended: false,
      },
      fixable: 'code',
    },
    create(context) {
      return {
        CallExpression(node) {
          console.log('Icon name format check');
        },
      };
    },
  },
};

export default {
  rules,
};
