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
      {/* Container Base matching the exact dual-split neon shield */}
      <div
        className={`${currentSize.box} bg-[#090d16] border border-cyan-900/40 flex items-center justify-center shadow-lg shadow-cyan-950/50 text-white transition-all duration-300 group-hover:scale-105 shrink-0 relative overflow-hidden ring-1 ring-white/5`}
      >
        <svg
          className={`${currentSize.icon}`}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="neonSplit" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="48%" stopColor="#38bdf8" />
              <stop offset="52%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
          </defs>

          {/* Outer Shield Outline with dual neon gradient */}
          <path
            d="M24 42s13-6.5 13-18V10L24 5 11 10v14c0 11.5 13 18 13 18z"
            stroke="url(#neonSplit)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Left Cyan Half */}
          <path
            d="M24 8.5L13.5 12.5V24c0 9 10.5 14.5 10.5 14.5V8.5z"
            fill="#0284c7"
            fillOpacity="0.32"
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
            stroke="#67e8f9"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <span className={`font-extrabold ${currentSize.text} text-stone-900 dark:text-white tracking-tight leading-none`}>
          Shield<span className="text-teal-600 dark:text-teal-400">Safe</span>
        </span>
      )}
    </div>
  );
};
