import React, { useState, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { TacticalButton } from './TacticalButton';

export const FullscreenToggle: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };
  
  return (
    <TacticalButton
      icon={isFullscreen ? Minimize : Maximize}
      onClick={toggleFullscreen}
      variant="secondary"
      className="!p-2"
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      {isFullscreen ? 'Вийти' : 'На весь екран'}
    </TacticalButton>
  );
};