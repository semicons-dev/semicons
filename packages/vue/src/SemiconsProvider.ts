import { defineComponent, h, type PropType } from 'vue';
import { provideSemicons } from './context';
import type { IconMode, IconSize } from './types';

export const SemiconsProvider = defineComponent({
  name: 'SemiconsProvider',
  props: {
    spriteUrl: { type: String, default: '/semicons.svg' },
    defaultMode: {
      type: String as PropType<IconMode>,
      default: 'auto',
    },
    defaultSize: {
      type: [Number, String] as PropType<IconSize>,
      default: 'md',
    },
    defaultDecorative: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { slots }) {
    provideSemicons({
      spriteUrl: props.spriteUrl,
      defaultMode: props.defaultMode,
      defaultSize: props.defaultSize,
      defaultDecorative: props.defaultDecorative,
    });

    return () => slots.default?.();
  },
});
