import { ICON_SIZE_MAP, type IconSize } from './types';

export function resolveSize(size: IconSize | undefined): number {
  if (size === undefined) {
    return ICON_SIZE_MAP.md;
  }
  if (typeof size === 'number') {
    return size;
  }
  return ICON_SIZE_MAP[size];
}

export function sanitizeUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url;
}
