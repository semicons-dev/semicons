import type { InlineIconData } from '../types';

interface RenderInlineProps {
  name: string;
  data: InlineIconData | undefined;
  size: number;
  title?: string;
  role?: 'presentation' | 'img' | undefined;
  ariaHidden?: boolean;
  ariaLabel?: string;
}

export function RenderInline({
  name,
  data,
  size,
  title,
  role,
  ariaHidden,
  ariaLabel,
}: RenderInlineProps): JSX.Element | null {
  if (!data) {
    return null;
  }

  const { svg, viewBox = '0 0 24 24' } = data;

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      role={role}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      dangerouslySetInnerHTML={{ __html: svg }}
    >
      {title && <title>{title}</title>}
    </svg>
  );
}
