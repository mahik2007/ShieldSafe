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
    sm: { img: 'w-7 h-8', text: 'text-lg' },
    md: { img: 'w-9 h-10', text: 'text-xl' },
    lg: { img: 'w-12 h-14', text: 'text-2xl' },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Exact uploaded shield logo */}
      <div className="relative shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
        <img
          src="/logo.jpg"
          alt="SHEcurity Shield Logo"
          className={`${currentSize.img} object-contain rounded-lg shadow-md shadow-teal-500/10`}
          onError={(e) => {
            // fallback to SVG if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <span className={`font-extrabold ${currentSize.text} text-white tracking-tight leading-none`}>
          Shield<span className="text-[#00E5BE]">Safe</span>
        </span>
      )}
    </div>
  );
};
