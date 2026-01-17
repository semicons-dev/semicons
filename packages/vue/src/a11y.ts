import type { IconMeta } from './types';

export interface A11yInput {
  decorative: boolean;
  ariaLabel?: string;
  name?: string;
  meta?: IconMeta;
}

export function computeA11yAttrs(input: A11yInput): Record<string, string | boolean | undefined> {
  const { decorative, ariaLabel, meta } = input;

  if (decorative) {
    return {
      'aria-hidden': true,
      role: 'presentation',
    };
  }

  const label = ariaLabel ?? meta?.a11yLabel;

  if (process.env.NODE_ENV === 'development') {
    if (!label) {
      console.warn(`[@semicons/vue] Icon with decorative=false should have aria-label`);
    }
  }

  return {
    role: 'img',
    'aria-label': label,
  };
}

export function validateA11y(input: A11yInput): void {
  const { decorative, ariaLabel, meta } = input;

  if (decorative) {
    if (ariaLabel) {
      console.warn(`[@semicons/vue] Icon with decorative=true should not have aria-label`);
    }
    return;
  }

  const label = ariaLabel ?? meta?.a11yLabel;
  if (!label) {
    console.warn(`[@semicons/vue] Icon with decorative=false requires aria-label`);
  }
}
