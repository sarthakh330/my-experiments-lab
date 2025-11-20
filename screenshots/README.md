# Screenshots Guide

This folder contains screenshots and GIFs showcasing the My Experiments Lab application.

## Required Screenshots/GIFs

### 1. Main Gallery View (`main-gallery.png`)
- **Type**: Screenshot (PNG)
- **What to capture**: Full home page showing the featured project section and the grid of experiment cards
- **Tool**: Use macOS Screenshot (Cmd+Shift+4) or any screenshot tool

### 2. Project Viewer (`project-viewer.gif`)
- **Type**: Animated GIF
- **What to capture**:
  1. Start at the main gallery
  2. Click on a project card
  3. Show the embedded iframe viewer opening
  4. Show interaction with the project
  5. Click back button to return to gallery
- **Tool**: Use [Kap](https://getkap.co/) or [LICEcap](https://www.cockos.com/licecap/) for screen recording

### 3. Filter Experience (`filter-demo.gif`)
- **Type**: Animated GIF
- **What to capture**:
  1. Show the full grid of projects
  2. Click on different filter tags
  3. Show projects filtering in real-time
  4. Try multiple filters
- **Tool**: Use Kap or LICEcap

### 4. Dragon Flight Game (`dragon-flight.gif`)
- **Type**: Animated GIF
- **What to capture**:
  1. Navigate to /public/dragon-flight/
  2. Record 10-15 seconds of gameplay
  3. Show the dragon flying and avoiding obstacles
- **Tool**: Use Kap or LICEcap

### 5. Platformer Game (`platformer.gif`)
- **Type**: Animated GIF
- **What to capture**:
  1. Navigate to /public/platformer/
  2. Record 10-15 seconds of gameplay
  3. Show character movement and jumping
- **Tool**: Use Kap or LICEcap

## Tips for Great Screenshots

- **Resolution**: Capture at least 1920x1080 or your native screen resolution
- **Clean up**: Close unnecessary tabs and windows
- **Browser**: Use Chrome or Firefox with developer tools closed
- **GIF Settings**:
  - Frame rate: 30fps
  - Max duration: 10-20 seconds
  - Optimize file size (keep under 5MB if possible)
- **Timing**: Keep GIFs smooth and demonstrate key interactions clearly

## Tools Recommendations

### macOS
- **Screenshots**: Built-in (Cmd+Shift+4)
- **GIF Recording**: [Kap](https://getkap.co/) (Free, open-source)
- **Alternative**: [Gifox](https://gifox.app/)

### Windows
- **Screenshots**: Built-in (Win+Shift+S)
- **GIF Recording**: [ScreenToGif](https://www.screentogif.com/) (Free)
- **Alternative**: [LICEcap](https://www.cockos.com/licecap/)

### Linux
- **Screenshots**: Built-in or Flameshot
- **GIF Recording**: [Peek](https://github.com/phw/peek) (Free)

## Quick Start

1. Run the dev server: `npm run dev`
2. Open http://localhost:5173 in your browser
3. Start capturing screenshots and GIFs following the guide above
4. Save files to this `screenshots/` folder with the exact names specified
5. Commit and push changes
