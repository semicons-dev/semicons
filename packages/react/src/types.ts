export type IconMode = 'auto' | 'sprite' | 'inline';

export type IconSize = number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const ICON_SIZE_MAP: Record<Exclude<IconSize, number>, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export interface IconMeta {
  deprecated?: boolean | string;
  a11yLabel?: string;
}

export interface InlineIconData {
  svg: string;
  viewBox?: string;
}

export interface SemiconsContextValue {
  spriteUrl?: string;
  defaultMode: IconMode;
  defaultSize?: IconSize;
  defaultDecorative: boolean;
}

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  mode?: IconMode;
  spriteUrl?: string;
  size?: IconSize;
  decorative?: boolean;
  ariaLabel?: string;
  title?: string;
}

export interface InlineIconsRecord {
  [name: string]: InlineIconData;
}

export interface IconMetaRecord {
  [name: string]: IconMeta;
}
