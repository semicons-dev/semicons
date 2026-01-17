import { Rule } from 'eslint';
import * as fs from 'fs';
import * as path from 'path';
import { TOKEN_NAME_PATTERN, type IconRegistry } from '../types.js';

export const RULE_NAME = 'valid-icon-token';

interface RuleOptions {
  iconComponentName?: string;
  iconNameProp?: string;
  registryPath?: string;
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
    let registry: IconRegistry | null = null;

    if (options.registryPath) {
      try {
        const registryFilePath = path.resolve(context.getFilename(), '..', options.registryPath);
        const content = fs.readFileSync(registryFilePath, 'utf-8');
        registry = JSON.parse(content) as IconRegistry;
      } catch {
      }
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

      if (registry) {
        const token = registry.tokens.find(t => t.name === tokenName);
        if (!token) {
          context.report({
            node,
            messageId: 'notInRegistry',
            data: { name: tokenName },
          });
        } else if (token.deprecated) {
          const replacement = token.replacement ? `; use "${token.replacement}" instead` : '';
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
