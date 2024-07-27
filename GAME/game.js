const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Adjust the canvas size to fit the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Load images
const backgroundImg = new Image();
backgroundImg.src = 'background.jpg';

const playerImg = new Image();
playerImg.src = 'player_image.png';

const obstacleImages = [
    new Image(),
    new Image(),
    new Image()
];
obstacleImages[0].src = 'obstacle_texture1.png';
obstacleImages[1].src = 'obstacle_texture2.png';
obstacleImages[2].src = 'obstacle_texture3.png';

const playerWidth = 30;
const playerHeight = 30;
const playerX = 100;
let playerY = HEIGHT - playerHeight;
const playerSpeed = 5;
let playerJump = false;
const playerJumpSpeed = 10;
let playerJumpHeight = 100;

const obstacleWidth = 40;
let obstacleHeight = 40;
let obstacleX = WIDTH;
const obstacleSpeed = 5;
const obstacleMinHeight = 30;
const obstacleMaxHeight = 100;

let score = 0;
let highestScore = 0;
let collision = false;

document.addEventListener('keydown', (event) => {
    if (event.key === ' ' && !playerJump && !collision) {
        playerJump = true;
    } else if (event.key === 'r' && collision) {
        restartGame();
    }
});

canvas.addEventListener('mousedown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    if (WIDTH / 2 - 100 <= mouseX && mouseX <= WIDTH / 2 + 100 && HEIGHT / 2 - 25 <= mouseY && mouseY <= HEIGHT / 2 + 25) {
        restartGame();
    }
});

function drawText(text, color, x, y) {
    ctx.fillStyle = color;
    ctx.font = '36px Arial';
    ctx.fillText(text, x, y);
}

function drawRestartButton() {
    ctx.fillStyle = 'black';
    ctx.fillRect(WIDTH / 2 - 100, HEIGHT / 2 - 25, 200, 50);
    drawText('Restart', 'white', WIDTH / 2 - 40, HEIGHT / 2 + 10);
}

function restartGame() {
    obstacleX = WIDTH;
    if (score > highestScore) {
        highestScore = score;
    }
    score = 0;
    collision = false;
}

function randomObstacleHeight() {
    return Math.floor(Math.random() * (obstacleMaxHeight - obstacleMinHeight + 1)) + obstacleMinHeight;
}

function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Move player
    if (playerJump) {
        if (playerJumpHeight >= -100) {
            let neg = 1;
            if (playerJumpHeight < 0) {
                neg = -1;
            }
            playerY -= (playerJumpHeight ** 2) * 0.002 * neg;
            playerJumpHeight -= 5;
        } else {
            playerJump = false;
            playerJumpHeight = 100;
        }
    }

    // Move obstacles and update score only if no collision
    if (!collision) {
        obstacleX -= obstacleSpeed;
        if (obstacleX < 0) {
            obstacleX = WIDTH;
            score += 1;
            obstacleHeight = randomObstacleHeight();
        }
    }

    // Collision detection
    if (playerX + playerWidth > obstacleX && playerX < obstacleX + obstacleWidth && playerY + playerHeight > HEIGHT - obstacleHeight) {
        collision = true;
    }

    // Draw background image
    ctx.drawImage(backgroundImg, 0, 0, WIDTH, HEIGHT);

    // Draw everything
    if (!collision) {
        ctx.drawImage(playerImg, playerX, playerY, playerWidth, playerHeight); // Draw player image
        const obstacleImg = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
        ctx.drawImage(obstacleImg, obstacleX, HEIGHT - obstacleHeight, obstacleWidth, obstacleHeight);
        drawText('Score: ' + score, 'black', 10, 40);
        drawText('Highest: ' + highestScore, 'black', 10, 80);
    } else {
        drawRestartButton();
        drawText('Latest Score: ' + score, 'black', 10, 120);
    }

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();