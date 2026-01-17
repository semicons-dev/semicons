import type { IconMeta, IconProps } from './types';

export function getAriaHidden(decorative: boolean): boolean {
  return decorative;
}

export function getRole(decorative: boolean): 'presentation' | 'img' | undefined {
  if (decorative) return 'presentation';
  return 'img';
}

export function getAriaLabel(
  decorative: boolean,
  providedLabel: string | undefined,
  metaLabel: string | undefined
): string | undefined {
  if (decorative) return undefined;
  return providedLabel ?? metaLabel;
}

export function validateA11y(
  decorative: boolean,
  ariaLabel: string | undefined,
  metaLabel: string | undefined,
  onWarning: (message: string) => void
): void {
  if (decorative) {
    if (ariaLabel) {
      onWarning('Icon with decorative=true should not have aria-label');
    }
    return;
  }

  const effectiveLabel = ariaLabel ?? metaLabel;
  if (!effectiveLabel) {
    onWarning('Icon with decorative=false requires aria-label');
  }
}
