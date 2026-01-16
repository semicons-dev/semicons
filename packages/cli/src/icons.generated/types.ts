export interface IconToken {
  name: string;
  path: string;
}

export const icons = {
  'core/home': 'home',
  'core/settings': 'settings',
  'core/user': 'user',
} as const;

export type IconName = (typeof icons)[keyof typeof icons];
