# My Experiments Lab

A modern, interactive gallery for AI and creative coding experiments. Built with Vite and vanilla JavaScript, this project showcases various web-based experiments and interactive demos.

## Overview

My Experiments Lab is a portfolio-style web application that features:
- **Featured Project Showcase** - Highlight your best experiment
- **Dynamic Experiments Grid** - Browse through all your projects
- **Filter System** - Organize experiments by categories/tags
- **Project Viewer** - Embedded iframe viewer for instant demos
- **Responsive Design** - Works seamlessly across devices

## Features

- 🎨 Modern, clean UI with smooth animations
- 🔍 Filter and search functionality
- 📱 Fully responsive design
- ⚡ Fast development with Vite
- 🧪 Built-in testing with Vitest
- 🎮 Includes sample projects (dragon-flight game, platformer)

## Tech Stack

- **Vite** - Lightning-fast build tool and dev server
- **JavaScript (ES6+)** - Modern vanilla JavaScript
- **CSS3** - Custom styling with CSS variables
- **Vitest** - Unit testing framework
- **jsdom** - DOM testing environment

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/my-experiments-lab.git

# Navigate to project directory
cd my-experiments-lab

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

### Build

```bash
# Create production build
npm run build
```

### Testing

```bash
# Run tests
npm test
```

## Project Structure

```
my-experiments-lab/
├── src/
│   ├── main.js          # Main application logic
│   ├── data.js          # Projects data and configuration
│   ├── style.css        # Application styles
│   ├── counter.js       # Example counter module
│   └── main.test.js     # Unit tests
├── public/
│   ├── dragon-flight/   # Dragon flight game demo
│   ├── platformer/      # Platformer game demo
│   └── placeholder.html # Placeholder template
├── index.html           # Main HTML entry point
├── package.json         # Project dependencies
└── .gitignore          # Git ignore rules
```

## Adding New Experiments

1. Add your experiment files to the `public/` directory
2. Update `src/data.js` with your project information:

```javascript
{
  id: 'your-project-id',
  title: 'Your Project Title',
  description: 'Brief description',
  tags: ['tag1', 'tag2'],
  link: '/public/your-project/',
  colorTheme: 'theme-color',
  featured: false,
  visual: '<!-- Your SVG or HTML visual -->'
}
```

3. Run the dev server to see your changes

## Contributing

Feel free to fork this project and add your own experiments! Pull requests are welcome.

## License

MIT License - Feel free to use this project for your own experiments and learning.

## Author

Built with ⚡ by Sarthak Handa

---

**Note**: This is a living laboratory for web experiments. Expect frequent updates and new additions!
