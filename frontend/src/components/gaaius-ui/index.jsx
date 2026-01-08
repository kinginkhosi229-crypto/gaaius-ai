// GAAIUS UI Component Library - Locked Design System
// These components enforce consistent, production-ready UI

import React from 'react';
import { cn } from '../../lib/utils';

// ============== DESIGN TOKENS ==============
export const GAAIUS_TOKENS = {
  colors: {
    primary: '#7c3aed',      // Violet
    secondary: '#06b6d4',    // Cyan
    accent: '#f59e0b',       // Amber
    success: '#10b981',      // Emerald
    warning: '#f59e0b',      // Amber
    error: '#ef4444',        // Red
    dark: {
      bg: '#050505',
      card: '#111111',
      border: 'rgba(255,255,255,0.1)',
      text: '#ffffff',
      muted: '#a1a1aa'
    },
    light: {
      bg: '#ffffff',
      card: '#f9fafb',
      border: '#e5e7eb',
      text: '#111827',
      muted: '#6b7280'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  },
  fonts: {
    heading: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace"
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    glow: '0 0 20px rgba(124, 58, 237, 0.3)'
  }
};

// ============== GAAIUS BUTTON ==============
export const GaaiusButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/10',
    outline: 'border-2 border-violet-500 text-violet-400 hover:bg-violet-500/10',
    ghost: 'hover:bg-white/5 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    gradient: 'bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white'
  };
  
  const sizes = {
    xs: 'px-2.5 py-1 text-xs rounded-md',
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-xl'
  };
  
  return (
    <button
      className={cn(
        'font-medium transition-all duration-200 flex items-center justify-center gap-2',
        'focus:outline-none focus:ring-2 focus:ring-violet-500/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
};

// ============== GAAIUS CARD ==============
export const GaaiusCard = ({ 
  children, 
  variant = 'default',
  hover = false,
  padding = 'md',
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-white/5 border border-white/10',
    elevated: 'bg-white/5 border border-white/10 shadow-lg',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
    gradient: 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10',
    outline: 'border-2 border-white/20 bg-transparent'
  };
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };
  
  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-200',
        variants[variant],
        paddings[padding],
        hover && 'hover:border-violet-500/50 hover:shadow-violet-500/10 hover:shadow-lg cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ============== GAAIUS INPUT ==============
export const GaaiusInput = ({ 
  label,
  error,
  icon,
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-4 text-base'
  };
  
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-white/80 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">{icon}</div>}
        <input
          className={cn(
            'w-full bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40',
            'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500',
            'transition-all duration-200',
            sizes[size],
            icon && 'pl-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/50',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

// ============== GAAIUS BADGE ==============
export const GaaiusBadge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-white/10 text-white/80',
    primary: 'bg-violet-500/20 text-violet-400',
    secondary: 'bg-cyan-500/20 text-cyan-400',
    success: 'bg-emerald-500/20 text-emerald-400',
    warning: 'bg-amber-500/20 text-amber-400',
    error: 'bg-red-500/20 text-red-400',
    pro: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30'
  };
  
  const sizes = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1 text-sm'
  };
  
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// ============== GAAIUS MODAL ==============
export const GaaiusModal = ({ 
  open, 
  onClose, 
  title, 
  description,
  children,
  size = 'md',
  className = ''
}) => {
  if (!open) return null;
  
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-[90vw]'
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        'relative w-full bg-[#111] border border-white/10 rounded-2xl shadow-2xl',
        'animate-in fade-in zoom-in-95 duration-200',
        sizes[size],
        className
      )}>
        {title && (
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {description && <p className="mt-1 text-sm text-white/60">{description}</p>}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ============== GAAIUS TABLE ==============
export const GaaiusTable = ({ 
  columns, 
  data,
  striped = true,
  hover = true,
  className = ''
}) => {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-white/10', className)}>
      <table className="w-full">
        <thead className="bg-white/5">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row, i) => (
            <tr 
              key={i} 
              className={cn(
                striped && i % 2 === 0 && 'bg-white/[0.02]',
                hover && 'hover:bg-white/5 transition-colors'
              )}
            >
              {columns.map((col, j) => (
                <td key={j} className="px-4 py-3 text-sm text-white/80">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============== GAAIUS STATS CARD ==============
export const GaaiusStatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon,
  className = ''
}) => {
  const changeColors = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-white/60'
  };
  
  return (
    <GaaiusCard hover className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/60">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {change && (
            <p className={cn('mt-1 text-sm', changeColors[changeType])}>
              {changeType === 'positive' && '↑'} {changeType === 'negative' && '↓'} {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-violet-500/20 rounded-xl text-violet-400">
            {icon}
          </div>
        )}
      </div>
    </GaaiusCard>
  );
};

// ============== GAAIUS NAV ==============
export const GaaiusNav = ({ 
  items, 
  logo,
  actions,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'bg-black/50 backdrop-blur-xl border-b border-white/10',
    transparent: 'bg-transparent',
    solid: 'bg-[#111] border-b border-white/10'
  };
  
  return (
    <nav className={cn('fixed top-0 left-0 right-0 z-50', variants[variant], className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {logo && <div className="flex-shrink-0">{logo}</div>}
          <div className="hidden md:flex items-center gap-1">
            {items.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  item.active 
                    ? 'text-white bg-white/10' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      </div>
    </nav>
  );
};

// ============== GAAIUS SIDEBAR ==============
export const GaaiusSidebar = ({ 
  items, 
  header,
  footer,
  collapsed = false,
  className = ''
}) => {
  return (
    <aside className={cn(
      'h-screen bg-[#0a0a0a] border-r border-white/10 flex flex-col',
      collapsed ? 'w-16' : 'w-64',
      'transition-all duration-300',
      className
    )}>
      {header && <div className="p-4 border-b border-white/10">{header}</div>}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {items.map((item, i) => (
          <a
            key={i}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
              item.active
                ? 'bg-violet-500/20 text-violet-400'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            )}
          >
            {item.icon}
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </a>
        ))}
      </nav>
      {footer && <div className="p-4 border-t border-white/10">{footer}</div>}
    </aside>
  );
};

// ============== GAAIUS AVATAR ==============
export const GaaiusAvatar = ({ 
  src, 
  name, 
  size = 'md',
  status,
  className = ''
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };
  
  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-gray-500',
    busy: 'bg-red-500',
    away: 'bg-amber-500'
  };
  
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  
  return (
    <div className={cn('relative', className)}>
      {src ? (
        <img src={src} alt={name} className={cn('rounded-full object-cover', sizes[size])} />
      ) : (
        <div className={cn(
          'rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-semibold text-white',
          sizes[size]
        )}>
          {initials}
        </div>
      )}
      {status && (
        <span className={cn(
          'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0a0a0a]',
          statusColors[status]
        )} />
      )}
    </div>
  );
};

// ============== GAAIUS PROGRESS ==============
export const GaaiusProgress = ({ 
  value = 0, 
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const variants = {
    default: 'bg-violet-500',
    gradient: 'bg-gradient-to-r from-violet-500 to-cyan-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500'
  };
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-white/10 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full transition-all duration-500 ease-out rounded-full', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-xs text-white/60 text-right">{Math.round(percentage)}%</p>
      )}
    </div>
  );
};

// ============== EXPORT ALL ==============
export default {
  GaaiusButton,
  GaaiusCard,
  GaaiusInput,
  GaaiusBadge,
  GaaiusModal,
  GaaiusTable,
  GaaiusStatsCard,
  GaaiusNav,
  GaaiusSidebar,
  GaaiusAvatar,
  GaaiusProgress,
  GAAIUS_TOKENS
};
