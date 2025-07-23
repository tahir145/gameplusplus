class SpaceInvaders {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Game state
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        // Game objects
        this.player = null;
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.particles = [];
        
        // Game settings
        this.enemySpeed = 1;
        this.enemyDirection = 1;
        this.enemyDropDistance = 20;
        
        // Input handling
        this.keys = {};
        this.setupEventListeners();
        
        // Mobile controls
        this.setupMobileControls();
        
        // Initialize game
        this.initGame();
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const aspectRatio = 4/3;
        
        if (window.innerWidth <= 768) {
            this.canvas.width = Math.min(containerWidth - 20, 400);
            this.canvas.height = this.canvas.width / aspectRatio;
        } else {
            this.canvas.width = Math.min(containerWidth - 20, 800);
            this.canvas.height = this.canvas.width / aspectRatio;
        }
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                this.shoot();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Button events
        document.getElementById('playBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.resetGame());
    }
    
    setupMobileControls() {
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        const shootBtn = document.getElementById('shootBtn');
        
        // Touch events for mobile controls
        leftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['ArrowLeft'] = true;
        });
        
        leftBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['ArrowLeft'] = false;
        });
        
        rightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['ArrowRight'] = true;
        });
        
        rightBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['ArrowRight'] = false;
        });
        
        shootBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.shoot();
        });
        
        // Mouse events for desktop
        leftBtn.addEventListener('mousedown', () => this.keys['ArrowLeft'] = true);
        leftBtn.addEventListener('mouseup', () => this.keys['ArrowLeft'] = false);
        rightBtn.addEventListener('mousedown', () => this.keys['ArrowRight'] = true);
        rightBtn.addEventListener('mouseup', () => this.keys['ArrowRight'] = false);
        shootBtn.addEventListener('click', () => this.shoot());
    }
    
    initGame() {
        // Initialize player
        this.player = {
            x: this.canvas.width / 2 - 25,
            y: this.canvas.height - 60,
            width: 50,
            height: 30,
            speed: 5,
            color: '#00ff41'
        };
        
        // Initialize enemies
        this.createEnemies();
        
        // Reset arrays
        this.bullets = [];
        this.enemyBullets = [];
        this.particles = [];
    }
    
    createEnemies() {
        this.enemies = [];
        const rows = 5;
        const cols = 10;
        const enemyWidth = 40;
        const enemyHeight = 30;
        const spacing = 10;
        
        const totalWidth = cols * (enemyWidth + spacing) - spacing;
        const startX = (this.canvas.width - totalWidth) / 2;
        const startY = 50;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                this.enemies.push({
                    x: startX + col * (enemyWidth + spacing),
                    y: startY + row * (enemyHeight + spacing),
                    width: enemyWidth,
                    height: enemyHeight,
                    color: this.getEnemyColor(row),
                    points: (5 - row) * 10
                });
            }
        }
    }
    
    getEnemyColor(row) {
        const colors = ['#ff4757', '#ff6b7a', '#ffa502', '#ffb142', '#2ed573'];
        return colors[row] || '#ffffff';
    }
    
    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gamePaused = false;
            this.gameLoop();
        }
    }
    
    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
            if (!this.gamePaused) {
                this.gameLoop();
            }
        }
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.enemySpeed = 1;
        this.gameOverScreen.style.display = 'none';
        
        this.updateUI();
        this.initGame();
        this.draw();
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update player
        this.updatePlayer();
        
        // Update bullets
        this.updateBullets();
        
        // Update enemies
        this.updateEnemies();
        
        // Update enemy bullets
        this.updateEnemyBullets();
        
        // Update particles
        this.updateParticles();
        
        // Check collisions
        this.checkCollisions();
        
        // Check game state
        this.checkGameState();
        
        // Random enemy shooting
        if (Math.random() < 0.002 * this.level) {
            this.enemyShoot();
        }
    }
    
    updatePlayer() {
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight'] && this.player.x < this.canvas.width - this.player.width) {
            this.player.x += this.player.speed;
        }
    }
    
    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.y -= bullet.speed;
            return bullet.y > 0;
        });
    }
    
    updateEnemies() {
        let moveDown = false;
        
        // Check if enemies hit the edge
        for (let enemy of this.enemies) {
            if ((enemy.x <= 0 && this.enemyDirection === -1) || 
                (enemy.x >= this.canvas.width - enemy.width && this.enemyDirection === 1)) {
                moveDown = true;
                break;
            }
        }
        
        if (moveDown) {
            this.enemyDirection *= -1;
            this.enemies.forEach(enemy => {
                enemy.y += this.enemyDropDistance;
            });
        } else {
            this.enemies.forEach(enemy => {
                enemy.x += this.enemySpeed * this.enemyDirection;
            });
        }
    }
    
    updateEnemyBullets() {
        this.enemyBullets = this.enemyBullets.filter(bullet => {
            bullet.y += bullet.speed;
            return bullet.y < this.canvas.height;
        });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            return particle.life > 0;
        });
    }
    
    shoot() {
        if (this.gameRunning && !this.gamePaused) {
            this.bullets.push({
                x: this.player.x + this.player.width / 2 - 2,
                y: this.player.y,
                width: 4,
                height: 10,
                speed: 7,
                color: '#00ff41'
            });
        }
    }
    
    enemyShoot() {
        if (this.enemies.length > 0) {
            const randomEnemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
            this.enemyBullets.push({
                x: randomEnemy.x + randomEnemy.width / 2 - 2,
                y: randomEnemy.y + randomEnemy.height,
                width: 4,
                height: 10,
                speed: 3,
                color: '#ff4757'
            });
        }
    }
    
    checkCollisions() {
        // Player bullets vs enemies
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                if (this.isColliding(bullet, enemy)) {
                    // Create explosion particles
                    this.createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color);
                    
                    // Update score
                    this.score += enemy.points;
                    
                    // Remove bullet and enemy
                    this.bullets.splice(i, 1);
                    this.enemies.splice(j, 1);
                    
                    this.updateUI();
                    break;
                }
            }
        }
        
        // Enemy bullets vs player
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            const bullet = this.enemyBullets[i];
            if (this.isColliding(bullet, this.player)) {
                // Create explosion particles
                this.createParticles(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.player.color);
                
                // Remove bullet and decrease lives
                this.enemyBullets.splice(i, 1);
                this.lives--;
                
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
                break;
            }
        }
        
        // Enemies vs player (collision)
        for (let enemy of this.enemies) {
            if (enemy.y + enemy.height >= this.player.y) {
                this.gameOver();
                break;
            }
        }
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: color,
                life: 30
            });
        }
    }
    
    checkGameState() {
        // Check if all enemies are destroyed
        if (this.enemies.length === 0) {
            this.nextLevel();
        }
    }
    
    nextLevel() {
        this.level++;
        this.enemySpeed += 0.5;
        this.score += 100 * this.level;
        
        this.updateUI();
        this.createEnemies();
        
        // Reset player position
        this.player.x = this.canvas.width / 2 - 25;
        
        // Clear bullets
        this.bullets = [];
        this.enemyBullets = [];
    }
    
    gameOver() {
        this.gameRunning = false;
        document.getElementById('finalScore').textContent = this.score;
        this.gameOverScreen.style.display = 'flex';
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars background
        this.drawStars();
        
        // Draw player
        this.drawPlayer();
        
        // Draw bullets
        this.drawBullets();
        
        // Draw enemies
        this.drawEnemies();
        
        // Draw enemy bullets
        this.drawEnemyBullets();
        
        // Draw particles
        this.drawParticles();
        
        // Draw pause overlay
        if (this.gamePaused) {
            this.drawPauseOverlay();
        }
    }
    
    drawStars() {
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
            const x = (i * 37) % this.canvas.width;
            const y = (i * 73) % this.canvas.height;
            this.ctx.fillRect(x, y, 1, 1);
        }
    }
    
    drawPlayer() {
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Draw player details
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(this.player.x + 20, this.player.y - 5, 10, 5);
        
        // Add glow effect
        this.ctx.shadowColor = this.player.color;
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        this.ctx.shadowBlur = 0;
    }
    
    drawBullets() {
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            
            // Add glow effect
            this.ctx.shadowColor = bullet.color;
            this.ctx.shadowBlur = 5;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            this.ctx.shadowBlur = 0;
        });
    }
    
    drawEnemies() {
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // Draw enemy details
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(enemy.x + 5, enemy.y + 5, 5, 5);
            this.ctx.fillRect(enemy.x + 30, enemy.y + 5, 5, 5);
            
            // Add glow effect
            this.ctx.shadowColor = enemy.color;
            this.ctx.shadowBlur = 5;
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            this.ctx.shadowBlur = 0;
        });
    }
    
    drawEnemyBullets() {
        this.enemyBullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            
            // Add glow effect
            this.ctx.shadowColor = bullet.color;
            this.ctx.shadowBlur = 5;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            this.ctx.shadowBlur = 0;
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 30;
            this.ctx.fillRect(particle.x, particle.y, 3, 3);
            this.ctx.globalAlpha = 1;
        });
    }
    
    drawPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Press Play to continue', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
}

// Additional utility functions and game enhancements
class GameEffects {
    static createScreenShake(canvas, duration = 200) {
        const originalTransform = canvas.style.transform;
        const startTime = Date.now();
        
        function shake() {
            const elapsed = Date.now() - startTime;
            if (elapsed < duration) {
                const intensity = (duration - elapsed) / duration * 3;
                const x = (Math.random() - 0.5) * intensity;
                const y = (Math.random() - 0.5) * intensity;
                canvas.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(shake);
            } else {
                canvas.style.transform = originalTransform;
            }
        }
        shake();
    }
    
    static playSound(frequency, duration, type = 'square') {
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        }
    }
}

// Enhanced game class with sound effects
class EnhancedSpaceInvaders extends SpaceInvaders {
    shoot() {
        super.shoot();
        GameEffects.playSound(800, 0.1, 'square');
    }
    
    enemyShoot() {
        super.enemyShoot();
        GameEffects.playSound(400, 0.2, 'sawtooth');
    }
    
    checkCollisions() {
        const originalEnemyCount = this.enemies.length;
        const originalLives = this.lives;
        
        super.checkCollisions();
        
        // Play sound effects
        if (this.enemies.length < originalEnemyCount) {
            GameEffects.playSound(600, 0.15, 'triangle');
        }
        
        if (this.lives < originalLives) {
            GameEffects.playSound(200, 0.5, 'sawtooth');
            GameEffects.createScreenShake(this.canvas);
        }
    }
    
    nextLevel() {
        super.nextLevel();
        GameEffects.playSound(1000, 0.3, 'sine');
    }
    
    gameOver() {
        super.gameOver();
        GameEffects.playSound(150, 1, 'sawtooth');
        GameEffects.createScreenShake(this.canvas, 500);
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.lastTime = performance.now();
        this.frameCount = 0;
    }
    
    update() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
    }
    
    getFPS() {
        return this.fps;
    }
}

// Local storage for high scores
class ScoreManager {
    static saveHighScore(score) {
        const highScores = this.getHighScores();
        highScores.push(score);
        highScores.sort((a, b) => b - a);
        highScores.splice(10); // Keep only top 10
        localStorage.setItem('spaceInvadersHighScores', JSON.stringify(highScores));
    }
    
    static getHighScores() {
        const scores = localStorage.getItem('spaceInvadersHighScores');
        return scores ? JSON.parse(scores) : [];
    }
    
    static getHighScore() {
        const scores = this.getHighScores();
        return scores.length > 0 ? scores[0] : 0;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if device supports touch
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Initialize the enhanced game
    const game = new EnhancedSpaceInvaders();
    const performanceMonitor = new PerformanceMonitor();
    
    // Add performance monitoring in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setInterval(() => {
            performanceMonitor.update();
            console.log(`FPS: ${performanceMonitor.getFPS()}`);
        }, 1000);
    }
    
    // Add high score display
    const highScore = ScoreManager.getHighScore();
    if (highScore > 0) {
        const scoreBoard = document.querySelector('.score-board');
        const highScoreElement = document.createElement('div');
        highScoreElement.className = 'score-item';
        highScoreElement.innerHTML = `
            <i class="fas fa-crown"></i>
            <span>High: <span id="highScore">${highScore}</span></span>
        `;
        scoreBoard.appendChild(highScoreElement);
    }
    
    // Override game over to save high score
    const originalGameOver = game.gameOver.bind(game);
    game.gameOver = function() {
        ScoreManager.saveHighScore(this.score);
        originalGameOver();
    };
    
    // Add keyboard shortcuts info for desktop users
    if (!isMobile) {
        const instructions = document.querySelector('.instructions');
        const keyboardInfo = document.createElement('div');
        keyboardInfo.className = 'keyboard-shortcuts';
        keyboardInfo.innerHTML = `
            <h3><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h3>
            <p><strong>Arrow Keys:</strong> Move left/right</p>
            <p><strong>Spacebar:</strong> Shoot</p>
            <p><strong>P:</strong> Pause/Resume</p>
            <p><strong>R:</strong> Reset Game</p>
        `;
        instructions.appendChild(keyboardInfo);
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'KeyP':
                    e.preventDefault();
                    game.togglePause();
                    break;
                case 'KeyR':
                    e.preventDefault();
                    game.resetGame();
                    break;
            }
        });
    }
    
    // Add visibility change handling to pause game when tab is not active
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && game.gameRunning && !game.gamePaused) {
            game.togglePause();
        }
    });
    
    // Add fullscreen support
    const gameContainer = document.querySelector('.game-container');
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'btn btn-secondary fullscreen-btn';
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Fullscreen';
    fullscreenBtn.style.position = 'absolute';
    fullscreenBtn.style.top = '10px';
    fullscreenBtn.style.right = '10px';
    fullscreenBtn.style.zIndex = '20';
    
    fullscreenBtn.addEventListener('click', () => {
        if (gameContainer.requestFullscreen) {
            gameContainer.requestFullscreen();
        } else if (gameContainer.webkitRequestFullscreen) {
            gameContainer.webkitRequestFullscreen();
        } else if (gameContainer.msRequestFullscreen) {
            gameContainer.msRequestFullscreen();
        }
    });
    
    gameContainer.style.position = 'relative';
    gameContainer.appendChild(fullscreenBtn);
    
    // Add loading animation
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <i class="fas fa-rocket fa-spin"></i>
            <h2>Loading Space Invaders...</h2>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        </div>
    `;
    
    // Add loading screen styles
    const loadingStyles = `
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            color: #fff;
        }
        
        .loading-content {
            text-align: center;
        }
        
        .loading-content i {
            font-size: 4rem;
            color: #00ff41;
            margin-bottom: 1rem;
        }
        
        .loading-bar {
            width: 300px;
            height: 10px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 5px;
            overflow: hidden;
            margin-top: 1rem;
        }
        
        .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, #00ff41, #00cc33);
            width: 0%;
            animation: loadingProgress 2s ease-in-out forwards;
        }
        
        @keyframes loadingProgress {
            to { width: 100%; }
        }
        
        .fullscreen-btn {
            display: none;
        }
        
        @media (min-width: 768px) {
            .fullscreen-btn {
                display: inline-flex;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = loadingStyles;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(loadingScreen);
    
    // Remove loading screen after 2 seconds
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(loadingScreen);
        }, 500);
    }, 2000);
    
    // Make game globally accessible for debugging
    window.spaceInvadersGame = game;
});

// Service Worker registration for PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
