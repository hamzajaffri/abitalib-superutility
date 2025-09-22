import { useState, useEffect, useCallback } from 'react';

export interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  fontFamily: string;
  layout: 'compact' | 'expanded';
  animations: boolean;
  autoSave: boolean;
}

const defaultSettings: SettingsState = {
  theme: 'system',
  fontSize: 16,
  fontFamily: 'inter',
  layout: 'expanded',
  animations: true,
  autoSave: true,
};

const applyTheme = (theme: 'light' | 'dark' | 'system') => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'light') {
    root.classList.remove('dark');
  } else {
    // System theme
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', isDark);
  }
};

const applyFontFamily = (fontFamily: string) => {
  const root = document.documentElement;
  switch (fontFamily) {
    case 'orbitron':
      root.style.setProperty('--font-family', '"Orbitron", monospace');
      break;
    case 'inter':
      root.style.setProperty('--font-family', '"Inter", sans-serif');
      break;
    case 'system':
    default:
      root.style.setProperty('--font-family', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif');
      break;
  }
};

const applyFontSize = (fontSize: number) => {
  const root = document.documentElement;
  root.style.setProperty('--base-font-size', `${fontSize}px`);
};

const applyAnimations = (animations: boolean) => {
  const root = document.documentElement;
  if (animations) {
    root.classList.remove('no-animations');
  } else {
    root.classList.add('no-animations');
  }
};

const applyLayout = (layout: 'compact' | 'expanded') => {
  const root = document.documentElement;
  root.classList.toggle('layout-compact', layout === 'compact');
  root.classList.toggle('layout-expanded', layout === 'expanded');
};

export const applySettings = (settings: SettingsState) => {
  applyTheme(settings.theme);
  applyFontFamily(settings.fontFamily);
  applyFontSize(settings.fontSize);
  applyAnimations(settings.animations);
  applyLayout(settings.layout);
};

export const useSettings = () => {
  const [settings, setSettingsState] = useState<SettingsState>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettingsState(parsedSettings);
        applySettings(parsedSettings);
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
        applySettings(defaultSettings);
      }
    } else {
      applySettings(defaultSettings);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      const currentSettings = JSON.parse(localStorage.getItem('app-settings') || JSON.stringify(defaultSettings));
      if (currentSettings.theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const setSettings = useCallback((newSettings: SettingsState) => {
    setSettingsState(newSettings);
    localStorage.setItem('app-settings', JSON.stringify(newSettings));
    applySettings(newSettings);
  }, []);

  return { settings, setSettings };
};