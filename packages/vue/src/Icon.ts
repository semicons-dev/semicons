import { defineComponent, h, computed, type PropType } from 'vue';
import type { IconProps, IconMode, IconSize } from './types';
import { useSemicons } from './context';
import { renderSpriteIcon } from './render/renderSprite';
import { renderInlineIcon } from './render/renderInline';
import { computeA11yAttrs, validateA11y } from './a11y';
import { resolveSize } from './utils';

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
        return renderInlineIcon(props.name, svgAttrs.value);
      }

      // auto mode: prefer sprite if URL available, fallback to inline
      if (spriteUrl) {
        const spriteResult = renderSpriteIcon(props.name, spriteUrl, svgAttrs.value);
        if (spriteResult) {
          return spriteResult;
        }
      }

      return renderInlineIcon(props.name, svgAttrs.value);
    };
  },
});
