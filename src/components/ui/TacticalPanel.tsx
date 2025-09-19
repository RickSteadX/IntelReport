import React from 'react';

interface TacticalPanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  hasTacticalBorder?: boolean;
  isGlassmorphic?: boolean;
  padding?: 'none' | 'small' | 'normal' | 'large';
}

export const TacticalPanel: React.FC<TacticalPanelProps> = ({
  children,
  title,
  className = '',
  hasTacticalBorder = true,
  isGlassmorphic = true,
  padding = 'normal',
}) => {
  // Define padding classes based on the padding prop
  const paddingClasses = {
    none: '',
    small: 'p-2',
    normal: 'p-4',
    large: 'p-6',
  };

  // Add extra padding for text when tactical border is used
  const contentPaddingClass = hasTacticalBorder ? 'p-safe' : '';

  return (
    <div 
      className={`
        ${isGlassmorphic ? 'tactical-glassmorphism' : 'tactical-panel'} 
        ${hasTacticalBorder ? 'tactical-border' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {title && (
        <div className={`border-b border-tactical-green-700 pb-2 mb-3 ${contentPaddingClass}`}>
          <h3 className="text-tactical-accent-yellow font-mono text-lg">{title}</h3>
        </div>
      )}
      <div className={contentPaddingClass}>
        {children}
      </div>
    </div>
  );
};