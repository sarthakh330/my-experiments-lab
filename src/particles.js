/**
 * Particle Parallax Background System
 * Inspired by Google Antigravity
 */

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;

    // Depth determines size and parallax speed (0.1 to 1.0)
    this.depth = Math.random() * 0.9 + 0.1;

    // Size: subtle and varied
    this.size = this.depth * 3 + 1;

    // Opacity: much more subtle
    this.opacity = this.depth * 0.3 + 0.15;

    // Velocity for drift animation
    this.vx = (Math.random() - 0.5) * 0.2;
    this.vy = (Math.random() - 0.5) * 0.2;

    // Current parallax offset
    this.offsetX = 0;
    this.offsetY = 0;

    // Target parallax offset (smoothed)
    this.targetOffsetX = 0;
    this.targetOffsetY = 0;
  }

  update(mouseX, mouseY) {
    // Drift movement
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around screen edges
    if (this.x < -10) this.x = this.canvas.width + 10;
    if (this.x > this.canvas.width + 10) this.x = -10;
    if (this.y < -10) this.y = this.canvas.height + 10;
    if (this.y > this.canvas.height + 10) this.y = -10;

    // Calculate parallax offset based on mouse position and depth
    // Closer particles (higher depth) move more
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    const mouseDistX = (mouseX - centerX) / centerX;
    const mouseDistY = (mouseY - centerY) / centerY;

    // Target offset is opposite to mouse movement (parallax effect)
    this.targetOffsetX = -mouseDistX * this.depth * 50;
    this.targetOffsetY = -mouseDistY * this.depth * 50;

    // Smooth interpolation (lerp) for fluid movement
    const smoothing = 0.1;
    this.offsetX += (this.targetOffsetX - this.offsetX) * smoothing;
    this.offsetY += (this.targetOffsetY - this.offsetY) * smoothing;
  }

  draw(ctx) {
    const drawX = this.x + this.offsetX;
    const drawY = this.y + this.offsetY;

    // Soft, elegant gradient
    const glowSize = this.size * 4;
    const gradient = ctx.createRadialGradient(
      drawX, drawY, 0,
      drawX, drawY, glowSize
    );

    // Subtle blue-to-transparent gradient
    gradient.addColorStop(0, `rgba(66, 133, 244, ${this.opacity})`);
    gradient.addColorStop(0.2, `rgba(105, 155, 247, ${this.opacity * 0.6})`);
    gradient.addColorStop(0.5, `rgba(150, 180, 250, ${this.opacity * 0.3})`);
    gradient.addColorStop(1, `rgba(200, 220, 255, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(drawX, drawY, glowSize, 0, Math.PI * 2);
    ctx.fill();
  }
}

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas with id "${canvasId}" not found`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];

    // Mouse position (start at center)
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;

    // Animation state
    this.animationId = null;

    // Initialize
    this.resize();
    this.createParticles();
    this.setupEventListeners();
    this.animate();
  }

  resize() {
    // Set canvas size to window size
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Recreate particles on resize
    if (this.particles.length > 0) {
      this.createParticles();
    }
  }

  createParticles() {
    this.particles = [];

    // Sparse, elegant particle count
    const area = this.canvas.width * this.canvas.height;
    const particleCount = Math.floor(area / 12000); // ~100-120 for typical screens
    const count = Math.max(80, Math.min(150, particleCount));

    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this.canvas));
    }
  }

  setupEventListeners() {
    // Mouse move tracking
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.resize();
    });

    // Touch support for mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouseX = e.touches[0].clientX;
        this.mouseY = e.touches[0].clientY;
      }
    });
  }

  animate() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw all particles
    this.particles.forEach(particle => {
      particle.update(this.mouseX, this.mouseY);
      particle.draw(this.ctx);
    });

    // Continue animation loop
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    // Clean up
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('touchmove', this.handleTouchMove);
  }
}

// Export initialization function
export function initParticles(canvasId = 'particle-canvas') {
  return new ParticleSystem(canvasId);
}
