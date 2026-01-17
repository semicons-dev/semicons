import { Rule } from 'eslint';

export const RULE_NAME = 'no-hardcoded-svg-import';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow importing raw SVG files; use Icon tokens instead.',
      recommended: true,
    },
    schema: [],
    messages: {
      message: 'Do not import raw SVG files directly. Use <Icon name="..." /> or reference via registry instead.',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value && typeof node.source.value === 'string') {
          if (node.source.value.endsWith('.svg')) {
            context.report({
              node,
              messageId: 'message',
            });
          }
        }
      },
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'require' &&
          node.arguments.length > 0
        ) {
          const arg = node.arguments[0];
          if (arg.type === 'Literal' && typeof arg.value === 'string') {
            if (arg.value.endsWith('.svg')) {
              context.report({
                node,
                messageId: 'message',
              });
            }
          }
        }
      },
    };
  },
};

export default rule;
