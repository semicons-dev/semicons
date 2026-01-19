import { defineComponent, h, computed, type PropType } from 'vue';
import type { IconProps, IconMode, IconSize, InlineIconData, IconMeta } from './types';
import { useSemicons } from './context';
import { renderSpriteIcon } from './render/renderSprite';
import { renderInlineIcon } from './render/renderInline';
import { computeA11yAttrs, validateA11y } from './a11y';
import { resolveSize } from './utils';

let INLINE_ICONS: Record<string, InlineIconData> = {};
let ICON_META: Record<string, IconMeta> = {};

export function setInlineIcons(icons: Record<string, InlineIconData>): void {
  INLINE_ICONS = icons;
}

export function setIconMeta(meta: Record<string, IconMeta>): void {
  ICON_META = meta;
}

export function getIconMeta(name: string): IconMeta | undefined {
  return ICON_META[name];
}

export function isDeprecated(name: string): boolean {
  const meta = ICON_META[name];
  return meta?.deprecated === true || typeof meta?.deprecated === 'string';
}

export const Icon = defineComponent({
  name: 'SemIcon',
  inheritAttrs: true,
  props: {
    name: {
      type: String,
      required: true,
    },
    mode: {
      type: String as PropType<IconMode>,
      default: undefined,
    },
    spriteUrl: {
      type: String,
      default: undefined,
    },
    size: {
      type: [Number, String] as PropType<IconSize>,
      default: undefined,
    },
    decorative: {
      type: Boolean,
      default: undefined,
    },
    ariaLabel: {
      type: String,
      default: undefined,
    },
    title: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { attrs }) {
    const ctx = useSemicons();

    const sizePx = computed(() => {
      return resolveSize(props.size ?? ctx.defaultSize);
    });

    const svgAttrs = computed(() => {
      const decorative = props.decorative ?? ctx.defaultDecorative ?? true;

      const a11yAttrs = computeA11yAttrs({
        decorative,
        ariaLabel: props.ariaLabel,
        name: props.name,
      });

      if (process.env.NODE_ENV === 'development') {
        validateA11y({
          decorative,
          ariaLabel: props.ariaLabel,
          name: props.name,
        });
      }

      return {
        width: sizePx.value,
        height: sizePx.value,
        ...attrs,
        ...a11yAttrs,
      };
    });

    return () => {
      const mode = props.mode ?? ctx.defaultMode ?? 'auto';
      const spriteUrl = props.spriteUrl ?? ctx.spriteUrl;

      const decorative = props.decorative ?? ctx.defaultDecorative ?? true;

      if (mode === 'sprite') {
        if (!spriteUrl) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[@semicons/vue] Sprite mode requires spriteUrl`);
          }
          return null;
        }
        return renderSpriteIcon(props.name, spriteUrl, svgAttrs.value);
      }

      if (mode === 'inline') {
        const inlineData = INLINE_ICONS[props.name];
        if (!inlineData) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[@semicons/vue] Icon "${props.name}" not found in inline data`);
          }
          return null;
        }
        return renderInlineIcon(props.name, inlineData, svgAttrs.value);
      }

      // auto mode: prefer sprite if URL available, fallback to inline
      if (spriteUrl) {
        const spriteResult = renderSpriteIcon(props.name, spriteUrl, svgAttrs.value);
        if (spriteResult) {
          return spriteResult;
        }
      }

      const inlineData = INLINE_ICONS[props.name];
      if (inlineData) {
        return renderInlineIcon(props.name, inlineData, svgAttrs.value);
      }

      if (process.env.NODE_ENV === 'development') {
        console.warn(`[@semicons/vue] Icon "${props.name}" not found in sprite or inline data`);
      }
      return null;
    };
  },
});
