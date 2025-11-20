const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

// Set canvas size to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game state
let gameStarted = false;
let gameOver = false;
let score = 0;
let gameSpeed = 1;
let lives = 3;
let highScores = [];
const MAX_HIGH_SCORES = 5;

// Plane properties
const plane = {
    x: canvas.width / 4,
    y: canvas.height / 2,
    width: 80,
    height: 30,
    speed: 5,
    gravity: 0.3,
    velocity: 0,
    lift: -8,
    rotation: 0,
    missiles: 0
};

// Dragons
const dragons = [];
const dragonSize = 40;
let dragonTimer = 0;
const dragonInterval = 2000;

// Fire Dragons (stationary fire spitters)
const fireDragons = [];
const fireDragonSize = 50;
let fireDragonTimer = 0;
const fireDragonInterval = 3000;

// Fireballs
const fireballs = [];
const fireballSize = 15;

// Volcanoes
const volcanoes = [];
const volcanoWidth = 160;
const volcanoHeight = 220;
let lastVolcanoX = 0;

// Lava balls
const lavaBalls = [];
const lavaBallSize = 20;

// Wind particles
const windParticles = [];
for (let i = 0; i < 100; i++) {
    createWindParticle();
}

// Missiles
const missiles = [];
const missileSize = 8;
const missileSpeed = 10;
let lastMissileFired = 0;
const missileInterval = 500; // Minimum time between missiles (ms)

// Add after game state variables
const celestialObjects = {};
const clouds = {
    background: [],
    foreground: []
};
const MAX_CLOUDS = {
    background: 4,
    foreground: 3
};

// Add tree configuration
const trees = [];
const MAX_TREES = 3;
const TREE_TYPES = ['pine', 'bamboo'];

function createWindParticle() {
    windParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: -(Math.random() * 4 + 2),
        speedY: Math.random() * 2 - 1,
        opacity: Math.random() * 0.3 + 0.1
    });
}

// Keyboard state tracking
const keys = {
    ArrowUp: false,
    Space: false, // For missiles
    Equal: false, // Speed up
    Minus: false  // Slow down
};

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        if (!gameStarted || gameOver) {
            startGame();
        } else {
            keys.Space = true;
            fireMissile();
        }
    } else if (e.key === '=' || e.key === '+') {
        gameSpeed = Math.min(gameSpeed + 0.2, 2);
    } else if (e.key === '-' || e.key === '_') {
        gameSpeed = Math.max(gameSpeed - 0.2, 0.5);
    } else if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === ' ') {
        keys.Space = false;
    } else if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

startButton.addEventListener('click', startGame);

function startGame() {
    gameStarted = true;
    gameOver = false;
    score = 0;
    lives = 3;
    gameSpeed = 1;
    plane.y = canvas.height / 2;
    plane.velocity = 0;
    plane.rotation = 0;
    dragons.length = 0;
    fireDragons.length = 0;
    fireballs.length = 0;
    volcanoes.length = 0;
    lavaBalls.length = 0;
    missiles.length = 0;
    clouds.background.length = 0;
    clouds.foreground.length = 0;
    trees.length = 0;  // Clear trees
    
    // Reset timers
    dragonTimer = 0;
    fireDragonTimer = 0;
    lastMissileFired = 0;
    lastVolcanoX = 0;
    
    // Load high scores at game start
    loadHighScores();
    
    startButton.style.display = 'none';
    
    // Show the main title again
    const mainTitle = document.querySelector('h1');
    if (mainTitle) {
        mainTitle.style.display = 'block';
    }
    
    gameLoop();
}

function createDragon() {
    const yPos = Math.random() * (canvas.height - 100) + 50;
    dragons.push({
        x: canvas.width + dragonSize,
        y: yPos,
        speed: Math.random() * 3 + 2,
        amplitude: Math.random() * 60 + 30,
        frequency: Math.random() * 0.02 + 0.01,
        initialY: yPos,
        scale: Math.random() * 0.5 + 0.8,
        rotation: 0
    });
}

function createFireDragon() {
    const yPos = Math.random() * (canvas.height - 200) + 100;
    fireDragons.push({
        x: canvas.width + fireDragonSize,
        y: yPos,
        scale: 1.2,
        rotation: 0,
        fireTimer: 0,
        fireInterval: Math.random() * 1000 + 1500
    });
}

function createFireball(dragon) {
    fireballs.push({
        x: dragon.x - fireDragonSize/2,
        y: dragon.y,
        speed: 8,
        size: fireballSize,
        rotation: 0
    });
}

function createVolcano() {
    volcanoes.push({
        x: canvas.width + volcanoWidth,
        width: volcanoWidth,
        height: volcanoHeight,
        erupting: false,
        eruptTimer: 0,
        eruptInterval: Math.random() * 2000 + 3000,
        nextEruptTime: Math.random() * 3000 + 2000
    });
}

function createLavaBall(volcano) {
    const angle = -Math.PI/2 + (Math.random() * Math.PI/3 - Math.PI/6);
    const speed = Math.random() * 4 + 8;
    
    lavaBalls.push({
        x: volcano.x + volcano.width/2,
        y: canvas.height - volcano.height,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        size: lavaBallSize,
        rotation: 0,
        gravity: 0.2
    });
}

function updatePlane() {
    plane.velocity += plane.gravity;
    
    if (keys.ArrowUp) {
        plane.velocity = plane.lift;
        plane.rotation = -15;
    } else {
        plane.rotation = plane.velocity * 2;
    }
    
    plane.y += plane.velocity;
    
    if (plane.y < 0) {
        plane.y = 0;
        plane.velocity = 0;
    }
    if (plane.y > canvas.height - plane.height) {
        plane.y = canvas.height - plane.height;
        plane.velocity = 0;
    }
}

function updateDragons() {
    dragonTimer += 16;
    if (dragonTimer >= dragonInterval) {
        createDragon();
        dragonTimer = 0;
    }
    
    for (let i = dragons.length - 1; i >= 0; i--) {
        const dragon = dragons[i];
        dragon.x -= dragon.speed * gameSpeed;
        dragon.y = dragon.initialY + Math.sin(dragon.x * dragon.frequency) * dragon.amplitude;
        dragon.rotation = Math.sin(dragon.x * dragon.frequency) * 15;
        
        const dx = plane.x + plane.width / 2 - (dragon.x + dragonSize / 2);
        const dy = plane.y + plane.height / 2 - (dragon.y + dragonSize / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (plane.width + dragonSize) / 2) {
            handleCollision();
        }
        
        if (dragon.x < -dragonSize) {
            dragons.splice(i, 1);
            score++;
        }
    }
}

function updateFireDragons() {
    fireDragonTimer += 16;
    if (fireDragonTimer >= fireDragonInterval) {
        createFireDragon();
        fireDragonTimer = 0;
    }
    
    fireDragons.forEach(dragon => {
        dragon.x -= 1 * gameSpeed;
        dragon.fireTimer += 16;
        
        if (dragon.fireTimer >= dragon.fireInterval) {
            createFireball(dragon);
            dragon.fireTimer = 0;
        }
    });
    
    // Remove off-screen fire dragons
    for (let i = fireDragons.length - 1; i >= 0; i--) {
        if (fireDragons[i].x < -fireDragonSize) {
            fireDragons.splice(i, 1);
            score += 2;
        }
    }
}

function updateFireballs() {
    for (let i = fireballs.length - 1; i >= 0; i--) {
        const fireball = fireballs[i];
        fireball.x -= fireball.speed * gameSpeed;
        fireball.rotation += 0.2;
        
        // Check collision with plane
        const dx = plane.x + plane.width / 2 - fireball.x;
        const dy = plane.y + plane.height / 2 - fireball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (plane.width + fireball.size) / 2) {
            handleCollision();
        }
        
        // Remove off-screen fireballs
        if (fireball.x < -fireball.size) {
            fireballs.splice(i, 1);
        }
    }
}

function updateVolcanoes() {
    // Create new volcano if needed
    if (volcanoes.length === 0 || 
        canvas.width - lastVolcanoX > canvas.width/2) {
        createVolcano();
        lastVolcanoX = canvas.width;
    }
    
    volcanoes.forEach(volcano => {
        volcano.x -= 0.5 * gameSpeed; // Slower movement for background effect
        volcano.eruptTimer += 16;
        
        if (volcano.eruptTimer >= volcano.nextEruptTime) {
            volcano.erupting = true;
            createLavaBall(volcano);
            volcano.eruptTimer = 0;
            volcano.nextEruptTime = Math.random() * 3000 + 2000;
        }
    });
    
    // Remove off-screen volcanoes
    volcanoes.forEach((volcano, index) => {
        if (volcano.x + volcano.width < 0) {
            volcanoes.splice(index, 1);
        }
    });
}

function updateLavaBalls() {
    for (let i = lavaBalls.length - 1; i >= 0; i--) {
        const lava = lavaBalls[i];
        lava.x += lava.velocityX * gameSpeed;
        lava.y += lava.velocityY * gameSpeed;
        lava.velocityY += lava.gravity;
        lava.rotation += 0.1;
        
        // Check collision with plane
        const dx = plane.x + plane.width/2 - lava.x;
        const dy = plane.y + plane.height/2 - lava.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (plane.width + lava.size)/2) {
            handleCollision();
        }
        
        // Remove if off screen
        if (lava.y > canvas.height || lava.x < -lava.size || lava.x > canvas.width + lava.size) {
            lavaBalls.splice(i, 1);
        }
    }
}

function updateWindParticles() {
    windParticles.forEach(particle => {
        particle.x += particle.speedX * gameSpeed;
        particle.y += particle.speedY * gameSpeed;
        
        if (particle.x < 0) {
            particle.x = canvas.width;
            particle.y = Math.random() * canvas.height;
            particle.opacity = Math.random() * 0.3 + 0.1;
        }
    });
}

function drawPlane() {
    ctx.save();
    ctx.translate(plane.x + plane.width / 2, plane.y + plane.height / 2);
    ctx.rotate(plane.rotation * Math.PI / 180);
    
    // Main body
    ctx.fillStyle = '#FECEA8';
    ctx.beginPath();
    ctx.moveTo(-plane.width/2, 0);
    ctx.lineTo(plane.width/2, 0);
    ctx.lineTo(plane.width/2 + 15, plane.height/2);
    ctx.lineTo(-plane.width/2, plane.height/2);
    ctx.closePath();
    ctx.fill();
    
    // Wing
    ctx.fillStyle = '#FF847C';
    ctx.beginPath();
    ctx.moveTo(-plane.width/4, plane.height/2);
    ctx.lineTo(plane.width/4, plane.height/2);
    ctx.lineTo(0, plane.height + 10);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

function drawDragon(dragon) {
    ctx.save();
    ctx.translate(dragon.x + dragonSize/2, dragon.y + dragonSize/2);
    ctx.rotate(dragon.rotation * Math.PI / 180);
    ctx.scale(dragon.scale, dragon.scale);
    
    // Body
    ctx.fillStyle = '#E84A5F';
    ctx.beginPath();
    ctx.moveTo(-dragonSize/2, 0);
    ctx.quadraticCurveTo(0, -dragonSize/2, dragonSize/2, 0);
    ctx.quadraticCurveTo(0, dragonSize/2, -dragonSize/2, 0);
    ctx.fill();
    
    // Wings
    const wingAngle = Math.sin(Date.now() * 0.01) * Math.PI/6;
    ctx.fillStyle = '#FF847C';
    
    // Left wing
    ctx.save();
    ctx.rotate(wingAngle);
    ctx.beginPath();
    ctx.moveTo(-dragonSize/4, 0);
    ctx.lineTo(-dragonSize, -dragonSize/2);
    ctx.lineTo(-dragonSize/2, dragonSize/4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // Right wing
    ctx.save();
    ctx.rotate(-wingAngle);
    ctx.beginPath();
    ctx.moveTo(dragonSize/4, 0);
    ctx.lineTo(dragonSize, -dragonSize/2);
    ctx.lineTo(dragonSize/2, dragonSize/4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // Tail
    ctx.fillStyle = '#E84A5F';
    ctx.beginPath();
    ctx.moveTo(-dragonSize/2, 0);
    ctx.quadraticCurveTo(-dragonSize, dragonSize/4, -dragonSize*1.2, -dragonSize/4);
    ctx.quadraticCurveTo(-dragonSize*0.8, 0, -dragonSize/2, 0);
    ctx.fill();
    
    ctx.restore();
}

function drawFireDragon(dragon) {
    ctx.save();
    ctx.translate(dragon.x + fireDragonSize/2, dragon.y + fireDragonSize/2);
    ctx.scale(dragon.scale, dragon.scale);
    
    // Body
    ctx.fillStyle = '#FF847C';
    ctx.beginPath();
    ctx.moveTo(-fireDragonSize/2, 0);
    ctx.quadraticCurveTo(0, -fireDragonSize/2, fireDragonSize/2, 0);
    ctx.quadraticCurveTo(0, fireDragonSize/2, -fireDragonSize/2, 0);
    ctx.fill();
    
    // Spikes
    ctx.fillStyle = '#E84A5F';
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(-fireDragonSize/2 + i * fireDragonSize/4, -fireDragonSize/4);
        ctx.lineTo(-fireDragonSize/2 + (i + 0.5) * fireDragonSize/4, -fireDragonSize/2);
        ctx.lineTo(-fireDragonSize/2 + (i + 1) * fireDragonSize/4, -fireDragonSize/4);
        ctx.closePath();
        ctx.fill();
    }
    
    // Head
    ctx.fillStyle = '#E84A5F';
    ctx.beginPath();
    ctx.arc(-fireDragonSize/2, 0, fireDragonSize/4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function drawFireball(fireball) {
    ctx.save();
    ctx.translate(fireball.x, fireball.y);
    ctx.rotate(fireball.rotation);
    
    // Inner glow
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, fireball.size);
    gradient.addColorStop(0, '#E84A5F');
    gradient.addColorStop(0.5, '#FF847C');
    gradient.addColorStop(1, 'rgba(254, 206, 168, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, fireball.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function drawVolcano(volcano) {
    ctx.save();
    
    // Base mountain gradient with Ukiyo-e inspired colors
    const baseGradient = ctx.createLinearGradient(
        volcano.x, canvas.height,
        volcano.x + volcano.width, canvas.height - volcano.height
    );
    baseGradient.addColorStop(0, '#2A363B');  // Dark base
    baseGradient.addColorStop(0.3, '#99B898');  // Subtle green mid-tone
    baseGradient.addColorStop(0.6, '#FECEA8');  // Warm highlight
    baseGradient.addColorStop(0.9, '#FF847C');  // Peak tint
    baseGradient.addColorStop(1, '#E84A5F');    // Summit highlight
    
    // Draw main mountain shape with Ukiyo-e inspired silhouette
    ctx.beginPath();
    ctx.moveTo(volcano.x - 20, canvas.height);
    
    // Left side of mountain
    ctx.bezierCurveTo(
        volcano.x + volcano.width * 0.2, canvas.height - volcano.height * 0.5,
        volcano.x + volcano.width * 0.4, canvas.height - volcano.height * 0.95,
        volcano.x + volcano.width * 0.5, canvas.height - volcano.height
    );
    
    // Right side of mountain with subtle asymmetry
    ctx.bezierCurveTo(
        volcano.x + volcano.width * 0.6, canvas.height - volcano.height * 0.95,
        volcano.x + volcano.width * 0.75, canvas.height - volcano.height * 0.6,
        volcano.x + volcano.width + 20, canvas.height
    );
    
    ctx.fillStyle = baseGradient;
    ctx.fill();
    
    // Add snow cap / highlight effect
    const snowGradient = ctx.createLinearGradient(
        volcano.x + volcano.width * 0.3, canvas.height - volcano.height,
        volcano.x + volcano.width * 0.7, canvas.height - volcano.height * 0.7
    );
    snowGradient.addColorStop(0, 'rgba(254, 206, 168, 0.4)');
    snowGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    snowGradient.addColorStop(1, 'rgba(254, 206, 168, 0)');
    
    ctx.beginPath();
    ctx.moveTo(volcano.x + volcano.width * 0.3, canvas.height - volcano.height * 0.9);
    ctx.quadraticCurveTo(
        volcano.x + volcano.width * 0.5, canvas.height - volcano.height * 1.05,
        volcano.x + volcano.width * 0.7, canvas.height - volcano.height * 0.9
    );
    ctx.quadraticCurveTo(
        volcano.x + volcano.width * 0.5, canvas.height - volcano.height * 0.85,
        volcano.x + volcano.width * 0.3, canvas.height - volcano.height * 0.9
    );
    ctx.fillStyle = snowGradient;
    ctx.fill();
    
    // Add misty base effect
    const mistGradient = ctx.createLinearGradient(
        volcano.x, canvas.height - volcano.height * 0.3,
        volcano.x, canvas.height
    );
    mistGradient.addColorStop(0, 'rgba(153, 184, 152, 0)');
    mistGradient.addColorStop(0.5, 'rgba(153, 184, 152, 0.1)');
    mistGradient.addColorStop(1, 'rgba(153, 184, 152, 0.2)');
    
    // Draw multiple layers of mist
    for (let i = 0; i < 3; i++) {
        const y = canvas.height - volcano.height * (0.2 + i * 0.1);
        const amplitude = 20 * (3 - i);
        const frequency = 0.002;
        
        ctx.beginPath();
        ctx.moveTo(volcano.x - 50, y);
        
        for (let x = 0; x <= volcano.width + 100; x += 10) {
            const waveY = y + Math.sin(x * frequency + Date.now() * 0.001) * amplitude;
            ctx.lineTo(volcano.x - 50 + x, waveY);
        }
        
        ctx.lineTo(volcano.x + volcano.width + 50, canvas.height);
        ctx.lineTo(volcano.x - 50, canvas.height);
        ctx.closePath();
        
        ctx.fillStyle = mistGradient;
        ctx.fill();
    }
    
    // Draw crater with ethereal glow when erupting
    if (volcano.erupting) {
        const craterGradient = ctx.createRadialGradient(
            volcano.x + volcano.width * 0.5, canvas.height - volcano.height * 0.85,
            5,
            volcano.x + volcano.width * 0.5, canvas.height - volcano.height * 0.85,
            40
        );
        craterGradient.addColorStop(0, '#E84A5F');
        craterGradient.addColorStop(0.4, 'rgba(232, 74, 95, 0.6)');
        craterGradient.addColorStop(1, 'rgba(232, 74, 95, 0)');
        
        ctx.fillStyle = craterGradient;
        ctx.beginPath();
        ctx.arc(
            volcano.x + volcano.width * 0.5,
            canvas.height - volcano.height * 0.85,
            40, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Add flowing smoke effect
        for (let i = 0; i < 5; i++) {
            const smokeY = canvas.height - volcano.height * 0.85 - i * 20;
            const waveOffset = Math.sin(Date.now() * 0.002 + i) * 15;
            
            const smokeGradient = ctx.createRadialGradient(
                volcano.x + volcano.width * 0.5 + waveOffset, smokeY,
                0,
                volcano.x + volcano.width * 0.5 + waveOffset, smokeY,
                50 + i * 10
            );
            smokeGradient.addColorStop(0, 'rgba(254, 206, 168, 0.2)');
            smokeGradient.addColorStop(0.5, 'rgba(254, 206, 168, 0.1)');
            smokeGradient.addColorStop(1, 'rgba(254, 206, 168, 0)');
            
            ctx.fillStyle = smokeGradient;
            ctx.beginPath();
            ctx.arc(
                volcano.x + volcano.width * 0.5 + waveOffset,
                smokeY,
                50 + i * 10,
                0, Math.PI * 2
            );
            ctx.fill();
        }
        
        volcano.erupting = false;
    }
    
    ctx.restore();
}

function drawLavaBall(lava) {
    ctx.save();
    ctx.translate(lava.x, lava.y);
    ctx.rotate(lava.rotation);
    
    // Enhanced lava gradient with more color stops
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, lava.size * 1.5);
    gradient.addColorStop(0, '#E84A5F');
    gradient.addColorStop(0.3, '#FF847C');
    gradient.addColorStop(0.6, 'rgba(254, 206, 168, 0.6)');
    gradient.addColorStop(1, 'rgba(254, 206, 168, 0)');
    
    // Main lava ball with glow
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, lava.size * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner core
    const innerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, lava.size * 0.5);
    innerGradient.addColorStop(0, '#FECEA8');
    innerGradient.addColorStop(0.5, '#E84A5F');
    innerGradient.addColorStop(1, 'rgba(232, 74, 95, 0)');
    
    ctx.fillStyle = innerGradient;
    ctx.beginPath();
    ctx.arc(0, 0, lava.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Add trailing effect
    const trailLength = 5;
    for (let i = 0; i < trailLength; i++) {
        const trailGradient = ctx.createRadialGradient(
            -i * 8, 0, 0,
            -i * 8, 0, lava.size * (1 - i/trailLength)
        );
        trailGradient.addColorStop(0, `rgba(254, 206, 168, ${0.2 - i * 0.04})`);
        trailGradient.addColorStop(1, 'rgba(254, 206, 168, 0)');
        
        ctx.fillStyle = trailGradient;
        ctx.beginPath();
        ctx.arc(-i * 8, 0, lava.size * (1 - i/trailLength), 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

function drawWindParticles() {
    windParticles.forEach(particle => {
        ctx.fillStyle = `rgba(153, 184, 152, ${particle.opacity})`;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x + particle.size * 3, particle.y);
        ctx.stroke();
    });
}

function drawScore() {
    ctx.fillStyle = '#FECEA8';
    ctx.font = '300 32px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 30, 50);
}

function drawHUD() {
    // Draw score
    ctx.fillStyle = '#FECEA8';
    ctx.font = '300 32px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 30, 50);
    
    // Draw speed
    ctx.textAlign = 'center';
    ctx.fillText(`Speed: ${gameSpeed.toFixed(1)}x`, canvas.width/2, 50);
    
    // Draw lives
    ctx.textAlign = 'right';
    ctx.fillText(`Lives: ${lives}`, canvas.width - 30, 50);
    
    // Draw controls help
    ctx.font = '300 16px Arial';
    ctx.fillText('+ / - : Speed Control', canvas.width - 30, 80);
    ctx.fillText('Space: Fire Missile', canvas.width - 30, 100);
}

function drawGameOver() {
    // Fade out background
    ctx.fillStyle = 'rgba(42, 54, 59, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Hide the main title during game over
    const mainTitle = document.querySelector('h1');
    if (mainTitle) {
        mainTitle.style.display = 'none';
    }
    
    // Game Over text
    ctx.fillStyle = '#E84A5F';
    ctx.font = '300 64px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 120);
    
    ctx.fillStyle = '#FECEA8';
    ctx.font = '300 32px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 - 60);
    
    // Draw High Scores Table
    const scores = loadHighScores();
    const tableTop = canvas.height / 2;
    const rowHeight = 40;
    const colWidth = 200;
    
    // Table Header
    ctx.font = '300 28px Arial';
    ctx.fillStyle = '#FF847C';
    ctx.fillText('Top 5 Scores', canvas.width / 2, tableTop);
    
    // Column Headers
    ctx.font = '300 24px Arial';
    ctx.fillStyle = '#FECEA8';
    ctx.fillText('Rank', canvas.width / 2 - colWidth, tableTop + rowHeight);
    ctx.fillText('Score', canvas.width / 2, tableTop + rowHeight);
    ctx.fillText('Date', canvas.width / 2 + colWidth, tableTop + rowHeight);
    
    // Table Rows
    ctx.font = '300 22px Arial';
    scores.forEach((highScore, index) => {
        const y = tableTop + (index + 2) * rowHeight;
        const date = new Date(highScore.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: '2-digit'
        });
        
        ctx.fillText(`#${index + 1}`, canvas.width / 2 - colWidth, y);
        ctx.fillText(highScore.score, canvas.width / 2, y);
        ctx.fillText(formattedDate, canvas.width / 2 + colWidth, y);
    });
    
    ctx.fillText('Press Space to Restart', canvas.width / 2, tableTop + 280);
    
    // Add tagline at the bottom
    ctx.font = '300 18px Arial';
    ctx.fillStyle = '#99B898';
    ctx.fillText('Made with ♥ using Cursor', canvas.width / 2, canvas.height - 30);
}

function handleCollision() {
    lives--;
    if (lives <= 0) {
        gameOver = true;
        saveHighScore(score);  // Save score when game ends
    } else {
        // Reset plane position but keep the game going
        plane.y = canvas.height / 2;
        plane.velocity = 0;
    }
}

function fireMissile() {
    const now = Date.now();
    if (now - lastMissileFired >= missileInterval) {
        // First missile (slightly upward)
        missiles.push({
            x: plane.x + plane.width,
            y: plane.y + plane.height/2 - 10,
            size: missileSize,
            speed: missileSpeed
        });
        
        // Second missile (slightly downward)
        missiles.push({
            x: plane.x + plane.width,
            y: plane.y + plane.height/2 + 10,
            size: missileSize,
            speed: missileSpeed
        });
        
        lastMissileFired = now;
    }
}

function updateMissiles() {
    for (let i = missiles.length - 1; i >= 0; i--) {
        const missile = missiles[i];
        missile.x += missile.speed * gameSpeed;
        
        // Check collision with dragons and fire dragons
        let hit = false;
        
        // Check regular dragons
        for (let j = dragons.length - 1; j >= 0; j--) {
            const dragon = dragons[j];
            const dx = missile.x - (dragon.x + dragonSize/2);
            const dy = missile.y - (dragon.y + dragonSize/2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < dragonSize) {
                dragons.splice(j, 1);
                hit = true;
                score += 2;
                break;
            }
        }
        
        // Check fire dragons
        if (!hit) {
            for (let j = fireDragons.length - 1; j >= 0; j--) {
                const dragon = fireDragons[j];
                const dx = missile.x - (dragon.x + fireDragonSize/2);
                const dy = missile.y - (dragon.y + fireDragonSize/2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < fireDragonSize) {
                    fireDragons.splice(j, 1);
                    hit = true;
                    score += 3;
                    break;
                }
            }
        }
        
        // Remove missile if it hits something or goes off screen
        if (hit || missile.x > canvas.width) {
            missiles.splice(i, 1);
        }
    }
}

function drawMissile(missile) {
    ctx.save();
    ctx.translate(missile.x, missile.y);
    
    // Missile body
    const gradient = ctx.createLinearGradient(-missile.size, 0, missile.size, 0);
    gradient.addColorStop(0, '#E84A5F');
    gradient.addColorStop(1, '#FECEA8');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(missile.size, 0);
    ctx.lineTo(-missile.size, -missile.size/2);
    ctx.lineTo(-missile.size, missile.size/2);
    ctx.closePath();
    ctx.fill();
    
    // Missile trail
    const trailGradient = ctx.createLinearGradient(-missile.size*3, 0, -missile.size, 0);
    trailGradient.addColorStop(0, 'rgba(254, 206, 168, 0)');
    trailGradient.addColorStop(1, 'rgba(232, 74, 95, 0.6)');
    
    ctx.fillStyle = trailGradient;
    ctx.beginPath();
    ctx.moveTo(-missile.size, -missile.size/2);
    ctx.lineTo(-missile.size*3, 0);
    ctx.lineTo(-missile.size, missile.size/2);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

function drawCloud(cloud, isBackground) {
    ctx.save();
    
    // Define cloud segments (circles)
    const segments = [
        { x: 0.2, y: 0.5, size: 0.4 },
        { x: 0.4, y: 0.3, size: 0.45 },
        { x: 0.6, y: 0.4, size: 0.5 },
        { x: 0.8, y: 0.5, size: 0.4 },
        { x: 0.5, y: 0.6, size: 0.45 }
    ];
    
    // Create base gradient for the cloud
    const baseGradient = ctx.createRadialGradient(
        cloud.x + cloud.width * 0.5, cloud.y + cloud.height * 0.5, 0,
        cloud.x + cloud.width * 0.5, cloud.y + cloud.height * 0.5, cloud.width * 0.6
    );
    baseGradient.addColorStop(0, `rgba(254, 206, 168, ${cloud.opacity})`);
    baseGradient.addColorStop(1, 'rgba(254, 206, 168, 0)');
    
    // Draw each cloud segment
    segments.forEach(segment => {
        const centerX = cloud.x + cloud.width * segment.x;
        const centerY = cloud.y + cloud.height * segment.y;
        const radius = cloud.height * segment.size;
        
        // Create individual gradient for each circle
        const circleGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        circleGradient.addColorStop(0, `rgba(254, 206, 168, ${cloud.opacity})`);
        circleGradient.addColorStop(0.6, `rgba(254, 206, 168, ${cloud.opacity * 0.8})`);
        circleGradient.addColorStop(1, 'rgba(254, 206, 168, 0)');
        
        ctx.fillStyle = circleGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Add highlight effect
    const highlightSegments = [
        { x: 0.3, y: 0.4, size: 0.2 },
        { x: 0.6, y: 0.3, size: 0.25 }
    ];
    
    highlightSegments.forEach(segment => {
        const centerX = cloud.x + cloud.width * segment.x;
        const centerY = cloud.y + cloud.height * segment.y;
        const radius = cloud.height * segment.size;
        
        const highlightGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${cloud.opacity * 0.3})`);
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.restore();
}

function createCloud(layer) {
    const isBackground = layer === 'background';
    const cloud = {
        x: Math.random() * canvas.width,
        y: isBackground ? 
            Math.random() * (canvas.height * 0.3) : 
            Math.random() * (canvas.height * 0.4) + canvas.height * 0.1,
        width: isBackground ? 
            Math.random() * 200 + 180 : // Slightly smaller for better circle formation
            Math.random() * 150 + 120,
        height: isBackground ? 
            Math.random() * 50 + 40 : // More consistent height-to-width ratio
            Math.random() * 40 + 30,
        opacity: isBackground ? 
            Math.random() * 0.12 + 0.04 : // Slightly reduced opacity for softer look
            Math.random() * 0.15 + 0.08,
        speed: isBackground ? 0.2 : 0.3
    };
    clouds[layer].push(cloud);
}

function updateClouds() {
    ['background', 'foreground'].forEach(layer => {
        // Create new clouds if needed
        while (clouds[layer].length < MAX_CLOUDS[layer]) {
            createCloud(layer);
        }
        
        // Update cloud positions
        clouds[layer].forEach(cloud => {
            cloud.x -= cloud.speed * gameSpeed;
            
            // Reset cloud when it moves off screen
            if (cloud.x + cloud.width < 0) {
                cloud.x = canvas.width;
                cloud.y = layer === 'background' ? 
                    Math.random() * (canvas.height * 0.3) : 
                    Math.random() * (canvas.height * 0.4) + canvas.height * 0.1;
                cloud.opacity = layer === 'background' ? 
                    Math.random() * 0.15 + 0.05 : 
                    Math.random() * 0.2 + 0.1;
            }
        });
    });
}

function createTree() {
    const type = TREE_TYPES[Math.floor(Math.random() * TREE_TYPES.length)];
    trees.push({
        x: canvas.width + 50,
        y: canvas.height, // Place trees at ground level
        type: type,
        scale: Math.random() * 0.3 + 0.7,
        speed: 0.5
    });
}

function updateTrees() {
    // Create new trees if needed
    if (trees.length < MAX_TREES && Math.random() < 0.005) {
        createTree();
    }
    
    // Update tree positions
    for (let i = trees.length - 1; i >= 0; i--) {
        const tree = trees[i];
        tree.x -= tree.speed * gameSpeed;
        
        // Remove trees that are off screen
        if (tree.x < -100) {
            trees.splice(i, 1);
        }
    }
}

function drawTree(tree) {
    ctx.save();
    ctx.translate(tree.x, tree.y);
    ctx.scale(tree.scale, tree.scale);
    
    if (tree.type === 'pine') {
        // Japanese Pine Tree
        // Trunk
        ctx.fillStyle = '#2A363B';
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.quadraticCurveTo(-5, -60, 0, -90); // Taller trunk
        ctx.quadraticCurveTo(5, -60, 10, 0);
        ctx.fill();
        
        // Foliage layers - moved up to match taller trunk
        const foliageLayers = [
            { y: -60, width: 60, height: 30 },
            { y: -80, width: 50, height: 25 },
            { y: -95, width: 40, height: 20 }
        ];
        
        ctx.fillStyle = '#99B898';
        foliageLayers.forEach(layer => {
            ctx.beginPath();
            ctx.moveTo(-layer.width/2, layer.y);
            ctx.quadraticCurveTo(0, layer.y - layer.height, layer.width/2, layer.y);
            ctx.quadraticCurveTo(0, layer.y - layer.height/2, -layer.width/2, layer.y);
            ctx.fill();
        });
        
    } else if (tree.type === 'bamboo') {
        // Bamboo Tree - made taller
        const segments = 6; // More segments
        const segmentHeight = 25; // Taller segments
        const maxSway = 12;
        
        for (let i = 0; i < segments; i++) {
            // Bamboo stalk with slight curve
            const sway = Math.sin(Date.now() * 0.001 + i) * maxSway * (i/segments);
            
            ctx.fillStyle = '#99B898';
            ctx.beginPath();
            ctx.moveTo(-3, -i * segmentHeight);
            ctx.quadraticCurveTo(
                sway, -i * segmentHeight - segmentHeight/2,
                -3, -(i+1) * segmentHeight
            );
            ctx.lineTo(3, -(i+1) * segmentHeight);
            ctx.quadraticCurveTo(
                sway, -i * segmentHeight - segmentHeight/2,
                3, -i * segmentHeight
            );
            ctx.closePath();
            ctx.fill();
            
            // Node ring
            if (i < segments - 1) {
                ctx.fillStyle = '#2A363B';
                ctx.fillRect(-4, -(i+1) * segmentHeight - 1, 8, 2);
            }
        }
        
        // Bamboo leaves at top
        ctx.fillStyle = '#99B898';
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2/3) + (Date.now() * 0.001);
            ctx.save();
            ctx.translate(0, -segments * segmentHeight);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(20, -15, 40, 0); // Larger leaves
            ctx.quadraticCurveTo(20, 8, 0, 0);
            ctx.fill();
            ctx.restore();
        }
    }
    
    ctx.restore();
}

function gameLoop() {
    if (!gameStarted) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updateWindParticles();
    updateClouds();
    updateTrees();
    
    // Draw background elements
    drawWindParticles();
    clouds.background.forEach(cloud => drawCloud(cloud, true));
    
    if (!gameOver) {
        updateVolcanoes();
        updateLavaBalls();
        updatePlane();
        updateDragons();
        updateFireDragons();
        updateFireballs();
        updateMissiles();
        
        // Draw in correct order (background to foreground)
        volcanoes.forEach(drawVolcano);
        trees.forEach(drawTree);  // Draw trees before lavaBalls
        lavaBalls.forEach(drawLavaBall);
        clouds.foreground.forEach(cloud => drawCloud(cloud, false));
        dragons.forEach(drawDragon);
        fireDragons.forEach(drawFireDragon);
        fireballs.forEach(drawFireball);
        missiles.forEach(drawMissile);
        drawPlane();
        drawHUD();
    } else {
        drawGameOver();
    }
    
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Load high scores from localStorage
function loadHighScores() {
    const saved = localStorage.getItem('planeGameHighScores');
    highScores = saved ? JSON.parse(saved) : [];
    return highScores;
}

// Save high scores to localStorage
function saveHighScore(score) {
    highScores = loadHighScores();
    const newScore = {
        score: score,
        date: new Date().toISOString()  // Store full date information
    };
    
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, MAX_HIGH_SCORES);
    
    localStorage.setItem('planeGameHighScores', JSON.stringify(highScores));
} 