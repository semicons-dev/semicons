import { createContext, useContext, type ReactNode } from 'react';
import type { SemiconsContextValue, IconMode, IconSize } from './types';

const defaultContextValue: SemiconsContextValue = {
  spriteUrl: '/semicons.svg',
  defaultMode: 'auto',
  defaultDecorative: true,
};

const SemiconsContext = createContext<SemiconsContextValue>(defaultContextValue);

export function useSemiconsContext(): SemiconsContextValue {
  return useContext(SemiconsContext);
}

interface SemiconsProviderProps {
  children: ReactNode;
  spriteUrl?: string;
  defaultMode?: IconMode;
  defaultSize?: IconSize;
  defaultDecorative?: boolean;
}

export function SemiconsProvider({
  children,
  spriteUrl = '/semicons.svg',
  defaultMode = 'auto',
  defaultSize,
  defaultDecorative = true,
}: SemiconsProviderProps): JSX.Element {
  const value: SemiconsContextValue = {
    spriteUrl,
    defaultMode,
    defaultSize,
    defaultDecorative,
  };

  return (
    <SemiconsContext.Provider value={value}>
      {children}
    </SemiconsContext.Provider>
  );
}

export { SemiconsContext };
