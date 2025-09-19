// Icon dictionary for mapping keywords to icon names

interface IconMapping {
  keywords: string[];
  icon: string;
}

// Dictionary of icon mappings
export const iconMappings: IconMapping[] = [
  {
    keywords: ['танк', 'танки', 'бронетехніка', 'бтр', 'бмп'],
    icon: 'tank'
  },
  {
    keywords: ['вантажівка', 'автомобіль', 'автомобілі', 'автоцистерна', 'автоцистерни', 'транспорт'],
    icon: 'truck'
  },
  {
    keywords: ['ббм', 'бойова машина', 'бойові машини', 'військовий транспорт'],
    icon: 'truck-military'
  },
  {
    keywords: ['ракета', 'ракети', 'рсзв', 'град', 'смерч', 'ураган'],
    icon: 'rocket'
  },
  {
    keywords: ['щит', 'захист', 'ппо', 'протиповітряна оборона', 'зенітка', 'зенітки'],
    icon: 'shield'
  },
  {
    keywords: ['літак', 'літаки', 'авіація', 'винищувач', 'бомбардувальник'],
    icon: 'plane'
  },
  {
    keywords: ['гелікоптер', 'гелікоптери', 'вертоліт', 'вертольоти', 'мі-8', 'мі-24'],
    icon: 'helicopter'
  },
  {
    keywords: ['бпла', 'дрон', 'дрони', 'безпілотник', 'безпілотники', 'орлан'],
    icon: 'drone'
  },
  {
    keywords: ['крилата ракета', 'крилаті ракети', 'калібр', 'томагавк'],
    icon: 'missile'
  },
  {
    keywords: ['корабель', 'кораблі', 'катер', 'катери', 'човен', 'човни', 'судно', 'судна', 'флот'],
    icon: 'ship'
  },
  {
    keywords: ['інструмент', 'інструменти', 'спецтехніка', 'спеціальна техніка', 'ремонт'],
    icon: 'wrench'
  },
  {
    keywords: ['радіо', 'радіостанція', 'зв\'язок', 'комунікація', 'реб', 'радіоелектронна боротьба'],
    icon: 'radio'
  },
  {
    keywords: ['радар', 'радари', 'рлс', 'радіолокаційна станція', 'локатор'],
    icon: 'radar'
  },
  {
    keywords: ['пускова установка', 'пускові установки', 'с-300', 'с-400', 'бук', 'пу'],
    icon: 'rocket-launch'
  },
  {
    keywords: ['артилерія', 'гармата', 'гармати', 'гаубиця', 'гаубиці', 'мста', 'д-30'],
    icon: 'artillery'
  }
];

/**
 * Find the appropriate icon for a given text based on keywords
 * @param text The text to analyze
 * @returns The icon name or 'wrench' as default
 */
export const findIconForText = (text: string): string => {
  // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Find the first mapping where any keyword is included in the text
  const mapping = iconMappings.find(mapping => 
    mapping.keywords.some(keyword => lowerText.includes(keyword))
  );
  
  // Return the icon or default to 'wrench'
  return mapping?.icon || 'wrench';
};

/**
 * Get all available icon names
 * @returns Array of icon names
 */
export const getAvailableIcons = (): string[] => {
  return [...new Set(iconMappings.map(mapping => mapping.icon))];
};