import { h, type VNode } from 'vue';
import type { InlineIconData } from '../types';

export function renderInlineIcon(
  name: string,
  data: InlineIconData,
  svgAttrs: Record<string, unknown>
): VNode | null {
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
