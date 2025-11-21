# 🚀 Running the Experiments Lab

## ✨ The Solution: Monorepo Structure (UPDATED!)

**All experiments now run from a single server!** No more managing multiple ports or running separate dev servers.

- **Everything**: `http://localhost:5173` (one Vite server for all!)
  - Dashboard: `http://localhost:5173`
  - Dragon Flight: `http://localhost:5173/experiments/dragon-flight/`
  - Platformer: `http://localhost:5173/experiments/platformer/`
  - Particle Background: `http://localhost:5173/experiments/particle-background/`
  - Video Intelligence: `http://localhost:5173/experiments/video-intelligence-agent/`

## ⚡ Quick Start

### Run Everything (One Command!)
```bash
cd my-experiments-lab
npm run dev:all
```

This starts:
- ✅ Dashboard on `localhost:5173` (static experiments)
- ✅ Video Intelligence Agent on `localhost:3000` (Next.js app)

### Run Dashboard Only
```bash
npm run dev
```
Note: Video Intelligence Agent won't work without its own server.

### How It Works

All experiments live in `public/experiments/`:
```
public/
└── experiments/
    ├── dragon-flight/
    ├── platformer/
    ├── particle-background/
    └── video-intelligence-agent/
```

Vite automatically serves everything in the `public` folder, so all experiments are instantly available with zero configuration.

## 🎮 How It Works Now

1. **Click any experiment card** → Opens slide-up modal with iframe viewer
2. **All experiments load from the same server** → No CORS issues, no port conflicts
3. **Console logging** → Check browser DevTools for detailed loading info with timestamps

## 📁 Project Structure

```
my-experiments-lab/              # Single unified codebase
├── public/
│   └── experiments/            # All experiments in one place
│       ├── dragon-flight/      # Dragon game
│       ├── platformer/         # Platformer game
│       ├── particle-background/ # GPU particles
│       └── video-intelligence-agent/ # Video AI
├── src/
│   ├── main.js                 # Enhanced with error handling & logging
│   └── data.js                 # Experiment definitions
└── package.json                # Single dev script
```

## 🔧 Adding New Experiments

To add a new experiment to the lab:

1. **Create your experiment folder** in `public/experiments/`:
   ```bash
   mkdir public/experiments/my-new-experiment
   # Add your index.html, CSS, JS files here
   ```

2. **Update `src/data.js`**:
   ```javascript
   {
     id: 'my-new-experiment',
     title: 'My New Experiment',
     description: 'Cool new demo',
     tags: ['Demo', 'WebGL'],
     link: '/experiments/my-new-experiment/',
     colorTheme: 'blue',
     featured: false,
     external: false,  // false = opens in viewer, true = new tab
     visual: `<svg>...</svg>`
   }
   ```

3. **That's it!** Run `npm run dev` and your experiment is live at:
   `http://localhost:5173/experiments/my-new-experiment/`

No need to configure multiple dev servers or manage ports!

## 🐛 Troubleshooting

**Experiment not loading in viewer:**
- Check browser DevTools console for detailed error messages with timestamps
- Verify the path in `data.js` matches the actual folder in `public/experiments/`
- Make sure `npm run dev` is running

**Console errors:**
- All errors are prefixed with `[Lab ERROR HH:MM:SS]` for easy debugging
- Check iframe load status messages: `✓ Successfully loaded` or `✗ Failed to load`
- Look for warnings about missing files or paths

**Changes not showing:**
- Vite has hot module replacement (HMR) - changes should appear instantly
- If not, try refreshing the browser (Cmd+R / Ctrl+R)
- Check the terminal for any build errors

## 🎯 Benefits of Monorepo Structure

✅ **Single source of truth** - No duplicate code
✅ **No port conflicts** - Everything on port 5173
✅ **Simplified workflow** - One command to run everything
✅ **Better debugging** - Console logging with timestamps
✅ **Faster development** - Hot module replacement for all experiments
✅ **Easier deployment** - Single build command
✅ **Consistent behavior** - All experiments load the same way
