import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  initializeTheme: () => void;
}

const THEME_STORAGE_KEY = 'friendlyFinanceTheme';

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDarkMode: false,

  toggleDarkMode: () => {
    const currentState = get();
    const newDarkMode = !currentState.isDarkMode;

    // Update localStorage
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newDarkMode));

    // Update document class for Tailwind dark mode
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Update state
    set({ isDarkMode: newDarkMode });
  },

  setDarkMode: (isDark: boolean) => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(isDark));

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    set({ isDarkMode: isDark });
  },

  initializeTheme: () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const isDark = savedTheme ? JSON.parse(savedTheme) : false;

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    set({ isDarkMode: isDark });
  }
}));

