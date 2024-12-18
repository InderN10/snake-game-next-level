const board = document.querySelector("#board");
const context = board.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const reset = document.querySelector("#reset");

const unitSize = 25;
let running = false;
let velocityX = unitSize;
let velocityY = 0;
let foodX;
let foodY;
let score = 0;
let boardX = 500;
let boardY = 500;
let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
];

// Load snake part images
const snakeHeadUp = new Image();
snakeHeadUp.src = 'images/head_up.png';

const snakeHeadDown = new Image();
snakeHeadDown.src = 'images/head_down.png';

const snakeHeadLeft = new Image();
snakeHeadLeft.src = 'images/head_left.png';

const snakeHeadRight = new Image();
snakeHeadRight.src = 'images/head_right.png';

const snakeBody = new Image();
snakeBody.src = 'images/body.png';

const snakeTailUp = new Image();
snakeTailUp.src = 'images/tail_up.png';

const snakeTailDown = new Image();
snakeTailDown.src = 'images/tail_up.png';

const snakeTailLeft = new Image();
snakeTailLeft.src = 'images/tail_up.png';

const snakeTailRight = new Image();
snakeTailRight.src = 'images/tail_up.png';

// Load apple image for the food
const appleImage = new Image();
appleImage.src = 'images/apple.png'; // Ensure this is the correct path

// Image loading check
let imagesLoaded = 0;
const totalImages = 9; // 8 snake images + 1 apple image

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        gameStart();
    }
}

snakeHeadUp.onload = checkImagesLoaded;
snakeHeadDown.onload = checkImagesLoaded;
snakeHeadLeft.onload = checkImagesLoaded;
snakeHeadRight.onload = checkImagesLoaded;
snakeBody.onload = checkImagesLoaded;
snakeTailUp.onload = checkImagesLoaded;
snakeTailDown.onload = checkImagesLoaded;
snakeTailLeft.onload = checkImagesLoaded;
snakeTailRight.onload = checkImagesLoaded;
appleImage.onload = checkImagesLoaded; // Ensure the apple image is loaded

// Initialize sounds
let eatFoodSound = new Audio('assets/sound/eatsound.mp3');
let gameOverSound = new Audio('assets/sound/gameover2.mp3');
let moveSnakeSound = new Audio('assets/sound/moveSnake.mp3');
let backgroundMusic = new Audio('assets/sound/backmusic.mp3');

// Set background music to loop
backgroundMusic.loop = true;

// Play background music when the game starts
function playBackgroundMusic() {
    backgroundMusic.play();
}

// Stop background music when the game ends
function stopBackgroundMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Reset the music to the beginning
}

window.addEventListener("keydown", changeDirection);
reset.addEventListener("click", resetGame);

// Start the game when images are loaded
function gameStart() {
    running = true;
    scoreText.textContent = `Score: ${score}`;
    createFood();
    drawFood();
    playBackgroundMusic();
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 90);
    } else {
        displayGameOver();
        stopBackgroundMusic();
    }
}

function clearBoard() {
    context.clearRect(0, 0, board.width, board.height);
}

function createFood() {
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, boardX - unitSize);
    foodY = randomFood(0, boardY - unitSize);
}

function drawFood() {
    context.drawImage(appleImage, foodX, foodY, unitSize, unitSize); // Use the apple image
}

function moveSnake() {
    const head = {
        x: snake[0].x + velocityX,
        y: snake[0].y + velocityY,
    };

    snake.unshift(head);

    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1;
        scoreText.textContent = `Score: ${score}`;
        createFood();
        eatFoodSound.play();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    // Draw head
    const head = snake[0];
    switch (true) {
        case (velocityX === unitSize):
            context.drawImage(snakeHeadRight, head.x, head.y, unitSize, unitSize);
            break;
        case (velocityX === -unitSize):
            context.drawImage(snakeHeadLeft, head.x, head.y, unitSize, unitSize);
            break;
        case (velocityY === unitSize):
            context.drawImage(snakeHeadDown, head.x, head.y, unitSize, unitSize);
            break;
        case (velocityY === -unitSize):
            context.drawImage(snakeHeadUp, head.x, head.y, unitSize, unitSize);
            break;
    }

    // Draw body
    for (let i = 1; i < snake.length - 1; i++) {
        context.drawImage(snakeBody, snake[i].x, snake[i].y, unitSize, unitSize);
    }

    // Draw tail
    const tail = snake[snake.length - 1];
    switch (true) {
        case (velocityX === unitSize):
            context.drawImage(snakeTailRight, tail.x, tail.y, unitSize, unitSize);
            break;
        case (velocityX === -unitSize):
            context.drawImage(snakeTailLeft, tail.x, tail.y, unitSize, unitSize);
            break;
        case (velocityY === unitSize):
            context.drawImage(snakeTailDown, tail.x, tail.y, unitSize, unitSize);
            break;
        case (velocityY === -unitSize):
            context.drawImage(snakeTailUp, tail.x, tail.y, unitSize, unitSize);
            break;
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const RIGHT = 39;
    const UP = 38;
    const DOWN = 40;

    const goingUp = (velocityY === -unitSize);
    const goingDown = (velocityY === unitSize);
    const goingRight = (velocityX === unitSize);
    const goingLeft = (velocityX === -unitSize);

    switch (true) {
        case (keyPressed === LEFT && !goingRight):
            velocityX = -unitSize;
            velocityY = 0;
            break;
        case (keyPressed === UP && !goingDown):
            velocityX = 0;
            velocityY = -unitSize;
            break;
        case (keyPressed === RIGHT && !goingLeft):
            velocityX = unitSize;
            velocityY = 0;
            break;
        case (keyPressed === DOWN && !goingUp):
            velocityX = 0;
            velocityY = unitSize;
            break;
    }
}

function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0 || snake[0].x >= boardX || snake[0].y < 0 || snake[0].y >= boardY):
            running = false;
            break;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
        }
    }
}

function displayGameOver() {
    gameOverSound.play();
    context.font = "50px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText("GAME OVER!", boardX / 2, boardY / 2);
}

function resetGame() {
    score = 0;
    velocityX = unitSize;
    velocityY = 0;
    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 },
    ];
    gameStart();
}