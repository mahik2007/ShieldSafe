import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#070a12] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer tracking-wide';

  const variants = {
    primary: 'bg-[#00E5BE] hover:bg-[#00c49f] text-[#070a12] font-bold shadow-md shadow-teal-500/20 focus:ring-[#00E5BE] active:bg-[#00a887]',
    gold: 'bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold shadow-md shadow-amber-950/40 focus:ring-amber-400 active:bg-amber-700',
    secondary: 'bg-[#111c2e] hover:bg-[#16253c] text-teal-300 focus:ring-teal-400 border border-teal-500/30 font-medium',
    outline: 'border border-stone-700 hover:border-teal-400/60 bg-[#0d1424] hover:bg-[#131d33] text-stone-200 focus:ring-teal-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500',
    ghost: 'text-stone-300 hover:text-white hover:bg-stone-800/80 focus:ring-stone-600',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-4.5 py-2 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-[#0d1424] rounded-2xl border border-stone-800/90 shadow-lg shadow-black/40 ring-1 ring-white/5 p-6 text-stone-100 ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate' | 'purple' | 'teal';
  className?: string;
}> = ({ children, variant = 'slate', className = '' }) => {
  const styles = {
    blue: 'bg-blue-950/70 text-blue-300 border-blue-800/80',
    emerald: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80',
    amber: 'bg-amber-950/70 text-amber-300 border-amber-800/80',
    rose: 'bg-rose-950/70 text-rose-300 border-rose-800/80',
    slate: 'bg-stone-800 text-stone-200 border-stone-700',
    purple: 'bg-teal-950/70 text-teal-300 border-teal-800/80',
    teal: 'bg-teal-950/80 text-[#00E5BE] border-teal-500/50 font-bold',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Alert: React.FC<{
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ type = 'info', title, children, className = '' }) => {
  const styles = {
    info: 'bg-[#0f1d2e] border-teal-500/40 text-teal-200',
    success: 'bg-emerald-950/50 border-emerald-800/70 text-emerald-200',
    warning: 'bg-amber-950/50 border-amber-800/70 text-amber-200',
    error: 'bg-rose-950/50 border-rose-800/70 text-rose-200',
  };

  return (
    <div className={`rounded-xl border p-4 text-sm ${styles[type]} ${className}`}>
      {title && <h4 className="font-bold mb-1 text-sm text-white">{title}</h4>}
      <div className="leading-relaxed">{children}</div>
    </div>
  );
};
