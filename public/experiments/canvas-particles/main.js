// Configuration
const PARTICLE_COUNT = 180; // Clean, manageable count (not 10,000!)
const FRICTION = 0.95; // Particles slow down over time
const MOUSE_RADIUS = 100; // Mouse influence distance
const REPULSION_STRENGTH = 5; // How strongly particles are pushed away
const CONNECTION_DISTANCE = 120; // Distance for drawing constellation lines
const RETURN_FORCE = 0.02; // Strength of force pulling particles back to origin

// Canvas setup
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouse = { x: null, y: null };

// Particle class
class Particle {
  constructor() {
    // Initial position - random across screen
    this.x = Math.random() * width;
    this.y = Math.random() * height;

    // Store original position for return force
    this.originX = this.x;
    this.originY = this.y;

    // Velocity
    this.vx = 0;
    this.vy = 0;

    // Visual properties - varying sizes for depth perception
    this.radius = 2 + Math.random() * 4; // 2px to 6px
    this.opacity = 0.1 + Math.random() * 0.15; // 0.1 to 0.25
  }

  update() {
    // Mouse repulsion - the core "Antigravity" effect
    if (mouse.x !== null && mouse.y !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < MOUSE_RADIUS) {
        // Particles accelerate away from cursor
        const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
        const angle = Math.atan2(dy, dx);

        this.vx += Math.cos(angle) * force * REPULSION_STRENGTH;
        this.vy += Math.sin(angle) * force * REPULSION_STRENGTH;
      }
    }

    // Optional: Return force - gently pulls particles back to origin
    const returnDx = this.originX - this.x;
    const returnDy = this.originY - this.y;

    this.vx += returnDx * RETURN_FORCE;
    this.vy += returnDy * RETURN_FORCE;

    // Apply friction - creates that smooth, drifting feel
    this.vx *= FRICTION;
    this.vy *= FRICTION;

    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges (optional containment)
    if (this.x < 0 || this.x > width) {
      this.vx *= -0.5;
      this.x = Math.max(0, Math.min(width, this.x));
    }
    if (this.y < 0 || this.y > height) {
      this.vy *= -0.5;
      this.y = Math.max(0, Math.min(height, this.y));
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
    ctx.fill();
  }

  // Calculate distance to another particle
  distanceTo(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

// Initialize canvas size
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  // Reinitialize particles on resize
  if (particles.length === 0) {
    initParticles();
  }
}

// Create all particles
function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}

// Draw constellation lines between nearby particles
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const distance = particles[i].distanceTo(particles[j]);

      if (distance < CONNECTION_DISTANCE) {
        // Line opacity based on distance - closer = more visible
        const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.1;

        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

// Animation loop
function animate() {
  // Clear canvas with slight trail effect for smoothness
  ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // Full clear for clean look
  ctx.fillRect(0, 0, width, height);

  // Draw constellation lines first (behind particles)
  drawConnections();

  // Update and draw all particles
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animate);
}

// Mouse event handlers
canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

canvas.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

// Window resize handler
window.addEventListener('resize', resizeCanvas);

// Initialize and start
resizeCanvas();
animate();
