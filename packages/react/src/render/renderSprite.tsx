import type { IconProps } from '../types';

interface RenderSpriteProps {
  name: string;
  spriteUrl: string;
  size: number;
  title?: string;
}

export function RenderSprite({
  name,
  spriteUrl,
  size,
  title,
}: RenderSpriteProps): JSX.Element {
  const href = `${spriteUrl}#${name}`;
  const xlinkHref = `${spriteUrl}#${name}`;

  return (
    <svg
      width={size}
      height={size}
      aria-hidden="true"
      role="presentation"
    >
      {title && <title>{title}</title>}
      <use href={href} />
      {/*
        xlinkHref fallback for legacy browsers
        Some environments may not support SVG2 href
      */}
      <use href={xlinkHref} xlinkHref={xlinkHref} style={{ display: 'none' }} />
    </svg>
  );
}
