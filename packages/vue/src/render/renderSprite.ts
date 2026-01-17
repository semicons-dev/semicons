import { h, type VNode } from 'vue';

export function renderSpriteIcon(
  name: string,
  spriteUrl: string,
  svgAttrs: Record<string, unknown>
): VNode {
  const href = `${spriteUrl}#${name}`;

  return h(
    'svg',
    svgAttrs,
    [
      h('use', { href }),
      h('use', {
        href,
        'xlink:href': href,
        style: { display: 'none' },
      }),
    ]
  );
}
