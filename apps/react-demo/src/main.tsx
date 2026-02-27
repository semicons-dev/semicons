import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 初始化 Semicons 图标
import { setInlineIcons, setIconMeta } from '@semicons/react';
import { INLINE_ICONS } from './icons.generated/inline';
import { ICON_META } from './icons.generated/types';
import registry from './icons.generated/registry.json';

const defaultTheme = registry.defaultTheme ?? 'light';
const themeSuffix = `:${defaultTheme}`;
const themedInlineIcons: Record<string, { svg: string; viewBox?: string }> = {};

Object.entries(INLINE_ICONS).forEach(([name, data]) => {
  if (name.endsWith(themeSuffix)) {
    themedInlineIcons[name.slice(0, -themeSuffix.length)] = data;
  }
  themedInlineIcons[name] = data;
});

setInlineIcons(themedInlineIcons);
setIconMeta(ICON_META);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
