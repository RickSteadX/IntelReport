import React from 'react';
import {
  Truck,
  Rocket,
  Shield,
  Plane,
  Drone,
  Sailboat,
  Wrench,
  Radio,
  Radar,
  type LucideProps
} from 'lucide-react';

interface MilitaryIconProps extends LucideProps {
  iconName: string;
}

export const MilitaryIcon: React.FC<MilitaryIconProps> = ({ iconName, ...props }) => {
  // Map icon names to Lucide components
  const getIcon = (name: string) => {
    switch (name) {
      case 'tank':
        return <Truck {...props} />; // Using Truck as fallback for tank
      case 'truck':
      case 'truck-military':
        return <Truck {...props} />;
      case 'rocket':
      case 'artillery':
        return <Rocket {...props} />;
      case 'shield':
        return <Shield {...props} />;
      case 'plane':
        return <Plane {...props} />;
      case 'helicopter':
        return <Plane {...props} />; // Using Plane as fallback for helicopter
      case 'drone':
        return <Drone {...props} />;
      case 'ship':
        return <Sailboat {...props} />;
      case 'wrench':
        return <Wrench {...props} />;
      case 'radio':
        return <Radio {...props} />;
      case 'radar':
        return <Radar {...props} />;
      case 'rocket-launch':
        return <Rocket {...props} />; // Using Rocket as fallback
      case 'missile':
        return <Rocket {...props} />; // Using Rocket as fallback
      default:
        return <Wrench {...props} />; // Default to Wrench if icon not found
    }
  };
  
  return getIcon(iconName);
};