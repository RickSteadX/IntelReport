import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface TacticalButtonProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  onClick?: (e?: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const TacticalButton: React.FC<TacticalButtonProps> = ({
  children,
  icon: Icon,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button',
}) => {
  const variantClasses = {
    primary: 'bg-tactical-green-800 hover:bg-tactical-green-700 border-tactical-green-600',
    secondary: 'bg-tactical-dark hover:bg-tactical-green-900 border-tactical-green-800',
    danger: 'bg-red-900 hover:bg-red-800 border-red-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        tactical-button ${variantClasses[variant]} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};