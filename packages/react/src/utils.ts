import { ICON_SIZE_MAP } from './types';
import type { IconSize } from './types';

export function resolveSize(size: IconSize): number {
  if (typeof size === 'number') {
    return size;
  }
  return ICON_SIZE_MAP[size];
}

export function sanitizeUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url;
}
