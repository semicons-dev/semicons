import type { IconName, IconMeta, InlineIconData } from '../types';
import { setInlineIcons, setIconMeta } from '../Icon';

export type { IconName, IconMeta, InlineIconData };

export interface GeneratedIcons {
  INLINE_ICONS: Record<string, InlineIconData>;
  ICON_META: Record<IconName, IconMeta>;
}

export function initFromGenerated(generated: GeneratedIcons): void {
  setInlineIcons(generated.INLINE_ICONS);
  setIconMeta(generated.ICON_META);
}

export { Icon } from '../Icon';
export { SemiconsProvider, useSemiconsContext } from '../context';
export type { IconProps, IconMode, IconSize, SemiconsContextValue } from '../types';
