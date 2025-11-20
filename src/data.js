export const projects = [
  {
    id: 'video-intelligence-agent',
    title: 'Video Intelligence Agent',
    description: 'An AI agent capable of understanding and analyzing video content with high precision.',
    tags: ['AI', 'Video Analysis', 'Agent'],
    link: 'http://localhost:3002',
    colorTheme: 'orange',
    featured: true,
    external: true,
    visual: `<svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#FFDBCF"/>
      <circle cx="100" cy="100" r="60" fill="#FF8B60" opacity="0.8"/>
      <path d="M70 70 L130 70 L130 130 L70 130 Z" stroke="white" stroke-width="4" fill="none"/>
      <circle cx="100" cy="100" r="20" fill="white"/>
    </svg>`
  },
  {
    id: 'dragon-flight-simulator',
    title: 'Dragon Flight Simulator',
    description: 'A physics-based flight simulator where you control a dragon through various environments.',
    tags: ['Simulation', 'Physics', 'Game'],
    link: '/dragon-flight/',
    colorTheme: 'blue',
    featured: false,
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
