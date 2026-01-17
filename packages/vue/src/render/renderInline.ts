import { h, type VNode } from 'vue';
import type { InlineIconData } from '../types';

// Inline icons data - imported from user-generated file
// Users should configure their build tool (Vite/Webpack) to alias this path
// For example, configure: resolve.alias['@semicons/generated'] = './src/icons.generated/inline.ts'
declare const INLINE_ICONS: Record<string, InlineIconData>;

export function renderInlineIcon(
  name: string,
  svgAttrs: Record<string, unknown>
): VNode | null {
  const data = INLINE_ICONS?.[name];

  if (!data) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[@semicons/vue] Icon "${name}" not found in inline data`);
    }
    return null;
  }

  const { svg, viewBox = '0 0 24 24' } = data;

  return h(
    'svg',
    {
      ...svgAttrs,
      viewBox,
      innerHTML: svg,
    }
  );
}
