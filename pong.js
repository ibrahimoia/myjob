const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 14;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 6;
const BALL_SPEED = 5;

// Game state
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Net
    ctx.fillStyle = '#fff';
    for (let i = 0; i < canvas.height; i += 28) {
        ctx.fillRect(canvas.width / 2 - 1, i, 2, 18);
    }

    // Player paddle
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // AI paddle
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.beginPath();
    ctx.arc(ballX + BALL_SIZE/2, ballY + BALL_SIZE/2, BALL_SIZE/2, 0, Math.PI * 2);
    ctx.fill();

    // Scores
    ctx.font = "36px Arial";
    ctx.fillText(playerScore, canvas.width / 2 - 60, 50);
    ctx.fillText(aiScore, canvas.width / 2 + 40, 50);
}

// Ball and paddle collision
function collidePaddle(paddleX, paddleY) {
    return (
        ballX < paddleX + PADDLE_WIDTH &&
        ballX + BALL_SIZE > paddleX &&
        ballY < paddleY + PADDLE_HEIGHT &&
        ballY + BALL_SIZE > paddleY
    );
}

function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}

// AI movement: follow the ball, but limited speed
function moveAI() {
    let target = ballY + BALL_SIZE/2 - PADDLE_HEIGHT/2;
    if (aiY + PADDLE_HEIGHT/2 < ballY + BALL_SIZE/2) {
        aiY += PADDLE_SPEED * 0.7;
    } else if (aiY + PADDLE_HEIGHT/2 > ballY + BALL_SIZE/2) {
        aiY -= PADDLE_SPEED * 0.7;
    }
    // Clamp
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

// Update game state
function update() {
    // Move ball
    ballX += ballVX;
    ballY += ballVY;

    // Ball collision with top/bottom
    if (ballY < 0) {
        ballY = 0;
        ballVY *= -1;
    }
    if (ballY + BALL_SIZE > canvas.height) {
        ballY = canvas.height - BALL_SIZE;
        ballVY *= -1;
    }

    // Ball collision with paddles
    if (collidePaddle(PLAYER_X, playerY)) {
        ballX = PLAYER_X + PADDLE_WIDTH;
        ballVX *= -1;
        // Add some spin based on where the ball hits the paddle
        let impact = (ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2);
        ballVY = impact * 0.25;
    }
    if (collidePaddle(AI_X, aiY)) {
        ballX = AI_X - BALL_SIZE;
        ballVX *= -1;
        let impact = (ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2);
        ballVY = impact * 0.25;
    }

    // Score check
    if (ballX < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX + BALL_SIZE > canvas.width) {
        playerScore++;
        resetBall();
    }

    moveAI();
}

// Game loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start the game
loop();