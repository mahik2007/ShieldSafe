import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-xl border transition-all duration-200 flex items-center justify-center text-xs font-semibold focus:outline-none cursor-pointer ${
        theme === 'dark'
          ? 'bg-[#111827] border-stone-800 text-amber-400 hover:text-amber-300 hover:bg-[#1a2336] shadow-sm'
          : 'bg-stone-100 border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-200 shadow-sm'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Dark and Light theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-teal-700 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
};

