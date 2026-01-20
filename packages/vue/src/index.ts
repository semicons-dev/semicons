export type {
  IconName,
  IconMode,
  IconSize,
  SemiconsContextValue,
  IconProps,
  IconMeta,
  InlineIconData,
  InlineIconsRecord,
  IconMetaRecord,
} from './types';

export { Icon, setInlineIcons, setIconMeta, getIconMeta, isDeprecated } from './Icon';
export { SemiconsProvider } from './SemiconsProvider';
export { useSemicons } from './context';

export * from './icons.generated/index.js';
