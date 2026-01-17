import { InjectionKey, inject, provide, reactive, type DeepReadonly } from 'vue';
import type { SemiconsContextValue } from './types';

const SemiconsContextKey: InjectionKey<DeepReadonly<SemiconsContextValue>> = Symbol('SemiconsContext');

const defaultContextValue: SemiconsContextValue = {
  spriteUrl: '/semicons.svg',
  defaultMode: 'auto',
  defaultDecorative: true,
};

export function provideSemicons(value: Partial<SemiconsContextValue>): void {
  const ctx = { ...defaultContextValue, ...value };
  provide(SemiconsContextKey, reactive(ctx) as DeepReadonly<SemiconsContextValue>);
}

export function useSemicons(): DeepReadonly<SemiconsContextValue> {
  return inject(SemiconsContextKey, defaultContextValue);
}
