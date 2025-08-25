// components/UI/Button.tsx
import { Loader2, type LucideIcon } from 'lucide-react';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;
  const classes = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" data-testid="loader-icon" />
      ) : (
        Icon && iconPosition === 'left' && <Icon size={16} data-testid="button-icon" />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={16} data-testid="button-icon" />}
    </button>
  );
};