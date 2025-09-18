import React from 'react';

interface TacticalPanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  hasTacticalBorder?: boolean;
  isGlassmorphic?: boolean;
}

export const TacticalPanel: React.FC<TacticalPanelProps> = ({
  children,
  title,
  className = '',
  hasTacticalBorder = true,
  isGlassmorphic = true,
}) => {
  return (
    <div 
      className={`
        ${isGlassmorphic ? 'tactical-glassmorphism' : 'tactical-panel'} 
        ${hasTacticalBorder ? 'tactical-border' : ''}
        ${className}
      `}
    >
      {title && (
        <div className="border-b border-tactical-green-700 pb-2 mb-3">
          <h3 className="text-tactical-accent-yellow font-mono text-lg">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};