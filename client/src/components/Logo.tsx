import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeClasses = {
    sm: { box: 'w-8 h-8 rounded-lg', icon: 'w-4 h-4', text: 'text-lg' },
    md: { box: 'w-10 h-10 rounded-xl', icon: 'w-5 h-5', text: 'text-xl' },
    lg: { box: 'w-14 h-14 rounded-2xl', icon: 'w-7 h-7', text: 'text-2xl' },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Container Base: Elegant in both light (stone-100 with border) and dark (deep navy with glow) */}
      <div
        className={`${currentSize.box} bg-white dark:bg-[#090d16] border border-stone-200 dark:border-cyan-900/40 flex items-center justify-center shadow-md shadow-stone-200/50 dark:shadow-cyan-950/60 text-white transition-all duration-300 group-hover:scale-105 shrink-0 relative overflow-hidden ring-1 ring-black/5 dark:ring-white/5`}
      >
        <svg
          className={`${currentSize.icon}`}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="neonSplit" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="48%" stopColor="#0ea5e9" />
              <stop offset="52%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>

          {/* Outer Shield Outline with dual neon gradient */}
          <path
            d="M24 42s13-6.5 13-18V10L24 5 11 10v14c0 11.5 13 18 13 18z"
            stroke="url(#neonSplit)"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Left Cyan Half */}
          <path
            d="M24 8.5L13.5 12.5V24c0 9 10.5 14.5 10.5 14.5V8.5z"
            fill="#0284c7"
            fillOpacity="0.28"
          />

          {/* Right Magenta Half */}
          <path
            d="M24 8.5L34.5 12.5V24c0 9-10.5 14.5-10.5 14.5V8.5z"
            fill="#f43f5e"
            fillOpacity="0.22"
          />

          {/* Center Dividing Spine */}
          <line
            x1="24"
            y1="7"
            x2="24"
            y2="40"
            stroke="#0ea5e9"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <span className={`font-extrabold ${currentSize.text} text-stone-900 dark:text-white tracking-tight leading-none`}>
          Shield<span className="text-teal-700 dark:text-teal-400">Safe</span>
        </span>
      )}
    </div>
  );
};
