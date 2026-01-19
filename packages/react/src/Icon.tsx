import { forwardRef, useMemo } from 'react';
import type { IconProps, IconMode, IconSize } from './types';
import { resolveSize } from './utils';
import { useSemiconsContext } from './context';
import { getAriaHidden, getRole, getAriaLabel, validateA11y } from './a11y';
import { RenderSprite } from './render/renderSprite';
import { RenderInline } from './render/renderInline';

let INLINE_ICONS: Record<string, { svg: string; viewBox?: string }> = {};
let ICON_META: Record<string, { deprecated?: boolean | string; a11yLabel?: string }> = {};

export function setInlineIcons(
  icons: Record<string, { svg: string; viewBox?: string }>
): void {
  INLINE_ICONS = icons;
}

export function setIconMeta(
  meta: Record<string, { deprecated?: boolean | string; a11yLabel?: string }>
): void {
  ICON_META = meta;
}

export function getIconMeta(name: string) {
  return ICON_META[name];
}

export function isDeprecated(name: string): boolean {
  const meta = ICON_META[name];
  return meta?.deprecated === true || typeof meta?.deprecated === 'string';
}

function warn(message: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[@semicons/react] ${message}`);
  }
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  function Icon(
    {
      name,
      mode: propMode,
      spriteUrl: propSpriteUrl,
      size: propSize,
      decorative: propDecorative = true,
      ariaLabel,
      title,
      ...restProps
    },
    ref
  ) {
    const context = useSemiconsContext();

    const mode: IconMode = propMode ?? context.defaultMode ?? 'auto';
    const spriteUrl = propSpriteUrl ?? context.spriteUrl;
    const size = resolveSize(propSize ?? (context.defaultSize as IconSize) ?? 'md');
    const decorative = propDecorative ?? context.defaultDecorative ?? true;

    const actualMode = useMemo((): 'sprite' | 'inline' | null => {
      if (mode === 'inline') return 'inline';
      if (mode === 'sprite') return 'sprite';

      if (spriteUrl) {
        return 'sprite';
      }

      if (INLINE_ICONS[name]) {
        return 'inline';
      }

      return null;
    }, [mode, spriteUrl, name]);

    const inlineData = useMemo(() => {
      return INLINE_ICONS[name];
    }, [name]);

    const ariaHidden = getAriaHidden(decorative);
    const role = getRole(decorative);
    const effectiveAriaLabel = getAriaLabel(decorative, ariaLabel, ICON_META[name]?.a11yLabel);

    if (process.env.NODE_ENV === 'development') {
      validateA11y(decorative, ariaLabel, ICON_META[name]?.a11yLabel, warn);
    }

    if (actualMode === null) {
      warn(`Icon "${name}" not found in sprite or inline data`);
      return null;
    }

    if (actualMode === 'sprite') {
      return (
        <span ref={ref} {...restProps}>
          <RenderSprite
            name={name}
            spriteUrl={spriteUrl!}
            size={size}
            title={title}
          />
        </span>
      );
    }

    return (
      <span ref={ref} {...restProps}>
        <RenderInline
          name={name}
          data={inlineData}
          size={size}
          title={title}
          role={role}
          ariaHidden={ariaHidden}
          ariaLabel={effectiveAriaLabel}
        />
      </span>
    );
  }
);
