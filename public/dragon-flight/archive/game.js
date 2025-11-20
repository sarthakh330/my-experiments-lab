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
    rotation: 0
};

// Dragons
const dragons = [];
const dragonSize = 40;
let dragonTimer = 0;
const dragonInterval = 2000;

// Wind particles
const windParticles = [];
for (let i = 0; i < 100; i++) {
    createWindParticle();
}

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
    ArrowUp: false
};

// Event listeners
document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
    if (e.key === ' ' && !gameStarted) {
        startGame();
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

startButton.addEventListener('click', startGame);

function startGame() {
    gameStarted = true;
    gameOver = false;
    score = 0;
    plane.y = canvas.height / 2;
    plane.velocity = 0;
    plane.rotation = 0;
    dragons.length = 0;
    startButton.style.display = 'none';
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
        dragon.x -= dragon.speed;
        dragon.y = dragon.initialY + Math.sin(dragon.x * dragon.frequency) * dragon.amplitude;
        dragon.rotation = Math.sin(dragon.x * dragon.frequency) * 15;
        
        const dx = plane.x + plane.width / 2 - (dragon.x + dragonSize / 2);
        const dy = plane.y + plane.height / 2 - (dragon.y + dragonSize / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (plane.width + dragonSize) / 2) {
            gameOver = true;
        }
        
        if (dragon.x < -dragonSize) {
            dragons.splice(i, 1);
            score++;
        }
    }
}

function updateWindParticles() {
    windParticles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
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

function drawGameOver() {
    ctx.fillStyle = 'rgba(42, 54, 59, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#E84A5F';
    ctx.font = '300 64px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    
    ctx.fillStyle = '#FECEA8';
    ctx.font = '300 32px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 60);
    ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 120);
}

function gameLoop() {
    if (!gameStarted) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updateWindParticles();
    drawWindParticles();
    
    if (!gameOver) {
        updatePlane();
        updateDragons();
        dragons.forEach(drawDragon);
        drawPlane();
        drawScore();
    } else {
        drawGameOver();
    }
    
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop(); 