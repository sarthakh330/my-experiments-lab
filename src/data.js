export const projects = [
  {
    id: 'video-intelligence-agent',
    title: 'Video Intelligence Agent',
    description: 'An AI agent capable of understanding and analyzing video content with high precision.',
    tags: ['AI', 'Video Analysis', 'Agent'],
    link: 'http://localhost:3000',
    colorTheme: 'orange',
    featured: true,
    external: false, // Next.js app - opens in same tab
    visual: `<svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#FFDBCF"/>
      <circle cx="100" cy="100" r="60" fill="#FF8B60" opacity="0.8"/>
      <path d="M70 70 L130 70 L130 130 L70 130 Z" stroke="white" stroke-width="4" fill="none"/>
      <circle cx="100" cy="100" r="20" fill="white"/>
    </svg>`
  },
  {
    id: 'antigravity-particles',
    title: 'Antigravity Particles',
    description: 'Liquid wave flow field with 3,000 particles using Simplex noise and curl noise - smooth displacement distortion.',
    tags: ['WebGL', 'Three.js', 'GPGPU', 'Flow Field'],
    link: '/experiments/antigravity-particles/index.html',
    colorTheme: 'blue',
    featured: false,
    external: false,
    visual: `<svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#D3E3FD"/>
      <circle cx="50" cy="50" r="3" fill="#699BF7" opacity="0.6"/>
      <circle cx="150" cy="70" r="2" fill="#699BF7" opacity="0.4"/>
      <circle cx="100" cy="100" r="4" fill="#4285F4" opacity="0.8"/>
      <circle cx="80" cy="140" r="2.5" fill="#699BF7" opacity="0.5"/>
      <circle cx="160" cy="130" r="3" fill="#699BF7" opacity="0.6"/>
      <circle cx="30" cy="160" r="2" fill="#699BF7" opacity="0.4"/>
      <circle cx="120" cy="50" r="2" fill="#699BF7" opacity="0.5"/>
      <circle cx="170" cy="160" r="2.5" fill="#4285F4" opacity="0.7"/>
      <circle cx="40" cy="120" r="2" fill="#699BF7" opacity="0.5"/>
    </svg>`
  },
  {
    id: 'canvas-particles',
    title: 'Canvas Particles',
    description: 'Clean, elegant HTML5 Canvas particle system with 180 particles - true Google Antigravity feel.',
    tags: ['Canvas', 'Particles', 'Interactive', 'Simple'],
    link: '/experiments/canvas-particles/index.html',
    colorTheme: 'blue',
    featured: false,
    external: false,
    visual: `<svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#F8F9FA"/>
      <circle cx="60" cy="60" r="4" fill="#333" opacity="0.2"/>
      <circle cx="140" cy="80" r="3" fill="#333" opacity="0.15"/>
      <circle cx="100" cy="100" r="5" fill="#333" opacity="0.25"/>
      <circle cx="80" cy="140" r="3.5" fill="#333" opacity="0.18"/>
      <circle cx="150" cy="130" r="4" fill="#333" opacity="0.2"/>
      <line x1="60" y1="60" x2="100" y2="100" stroke="#333" stroke-width="0.5" opacity="0.1"/>
      <line x1="100" y1="100" x2="150" y2="130" stroke="#333" stroke-width="0.5" opacity="0.1"/>
    </svg>`
  },
  {
    id: 'dragon-flight-simulator',
    title: 'Dragon Flight Simulator',
    description: 'A physics-based flight simulator where you control a dragon through various environments.',
    tags: ['Simulation', 'Physics', 'Game'],
    link: '/experiments/dragon-flight/index.html',
    colorTheme: 'lime',
    featured: false,
    external: false,
    visual: `<svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#EEFAD1"/>
      <path d="M40 100 Q100 40 160 100 T280 100" stroke="#D4F674" stroke-width="4" fill="none"/>
      <circle cx="100" cy="100" r="10" fill="#D4F674"/>
      <path d="M20 150 L180 150" stroke="#D4F674" stroke-width="2" stroke-dasharray="5,5"/>
    </svg>`
  },
  {
    id: 'titanium-platformer',
    title: 'Titanium Platformer',
    description: 'A minimalist platformer with premium aesthetics and smooth physics.',
    tags: ['Game', 'Platformer', 'Design'],
    link: '/experiments/platformer/index.html',
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
