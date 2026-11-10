import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`px-3 py-1.5 rounded-xl border transition-all duration-200 flex items-center gap-2 text-xs font-semibold focus:outline-none cursor-pointer select-none ${
        theme === 'dark'
          ? 'bg-[#111827] border-stone-800 text-stone-200 hover:text-white hover:bg-[#1f293d] shadow-sm'
          : 'bg-white border-stone-300 text-stone-800 hover:text-stone-950 hover:bg-stone-50 shadow-sm'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Dark and Light theme"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span className="hidden sm:inline text-[11px] font-medium text-stone-300">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-teal-700" />
          <span className="hidden sm:inline text-[11px] font-medium text-stone-700">Dark</span>
        </>
      )}
    </button>
  );
};
