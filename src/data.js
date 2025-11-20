export const projects = [
  {
    id: 'dragon-flight-simulator',
    title: 'Dragon Flight Simulator',
    description: 'A physics-based flight simulator where you control a dragon through various environments.',
    tags: ['Simulation', 'Physics', 'Game'],
    link: '/dragon-flight/',
    colorTheme: 'blue',
    featured: true,
    visual: `<svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#D3E3FD"/>
      <path d="M40 100 Q100 40 160 100 T280 100" stroke="#699BF7" stroke-width="4" fill="none"/>
      <circle cx="100" cy="100" r="10" fill="#699BF7"/>
      <path d="M20 150 L180 150" stroke="#699BF7" stroke-width="2" stroke-dasharray="5,5"/>
    </svg>`
  },
  {
    id: 'titanium-platformer',
    title: 'Titanium Platformer',
    description: 'A minimalist platformer with premium aesthetics and smooth physics.',
    tags: ['Game', 'Platformer', 'Design'],
    link: '/platformer/',
    colorTheme: 'pink',
    featured: false,
    visual: `<svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#FDD5EA"/>
      <rect x="50" y="120" width="100" height="10" rx="5" fill="#F7A4D4"/>
      <circle cx="100" cy="100" r="15" fill="#F7A4D4"/>
      <circle cx="130" cy="80" r="5" fill="#fff" opacity="0.5"/>
    </svg>`
  }
];
