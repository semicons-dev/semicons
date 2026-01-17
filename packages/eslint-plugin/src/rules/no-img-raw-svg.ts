import { Rule } from 'eslint';

export const RULE_NAME = 'no-img-raw-svg';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Discourage using <img> with SVG sources; use Icon component instead.',
      recommended: true,
    },
    schema: [],
    messages: {
      message: 'Avoid using <img> tag with SVG source. Use <Icon name="..." /> for semantic icon usage.',
    },
  },
  create(context) {
    function isSvgSource(value: unknown): boolean {
      if (typeof value === 'string' && value.endsWith('.svg')) {
        return true;
      }
      return false;
    }

    function checkNode(node: any): void {
      if (
        node.name?.type === 'JSXIdentifier' &&
        node.name.name === 'img'
      ) {
        const srcAttr = node.attributes?.find(
          (attr: any) =>
            attr.type === 'JSXAttribute' &&
            (attr.name?.type === 'JSXIdentifier' || attr.name?.type === 'Identifier') &&
            attr.name.name === 'src' &&
            attr.value?.type === 'Literal'
        );

        if (srcAttr && isSvgSource(srcAttr.value?.value)) {
          context.report({
            node,
            messageId: 'message',
          });
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
