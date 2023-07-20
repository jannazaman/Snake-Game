// Select elements (screen)
const scoreEl = document.querySelector('.score');
const highScoreEl = document.querySelector('.high-score');
const gameOverEl = document.querySelector('.game-over');
const playAgainBtn = document.querySelector('.play-again');

// Get the HTML element with the id 'cvs' and assign it to the variable 'cvs'
const cvs = document.getElementById('cvs');

// Get the 2D rendering (drawing) context of the canvas element
// ctx variable perform various drawing operations - drawing lines, shapes, images, and text on the canvas.
const ctx = cvs.getContext('2d');

// Add a white border to cvs
cvs.style.border = '1px solid #fff';

// cvs dimensions - refer to the width and height dimensions of the canvas.
const width = cvs.width,
  height = cvs.height;

// --------- GAME VARIABLES -------

// This represents the frame rate of the game (15 frames per second).
const FPS = 1000/15;

// Declares a variable called gameLoop which will be used to store the interval ID returned by setInterval.
let gameLoop;
const squareSize = 20;
let gameStarted = false; // Indicating that the game has not yet started. 

// Game Colors
let boardColor = '#000000'; // Black color for the board
let headColor = '#B0DBF1'; // Light blue color for the snake head
let bodyColor = '#2a9df4'; // Dark blue color for the snake body

// Variable to store the current direction of movement
let currentDirection = '';
let directionsQueue = [];
const directions = {
  RIGHT: 'ArrowRight',
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
};

// Draw Board
function drawBoard() { 
  // COLOR you want to fill the rectangle 
  ctx.fillStyle = boardColor;

  // Draws a filled rectangle on the canvas starting from the top-left corner
  // and spanning the entire width and height of the canvas
  ctx.fillRect(0, 0, width, height);
}

// Draw square - Food
function drawSquare(x, y, color) {
  // Color you want to fill the square 
  ctx.fillStyle = color;

  // Draws a filled rectangle representing the square
  ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);

  // Set the color of the stroke to match the color of the board
  ctx.strokeStyle = boardColor;

  // Draw the stroke rectangle
  ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
}

// Snake segments - represents the head, body and tail
let snake = [
  { x: 2, y: 0 }, // Head - 2 square from left
  { x: 1, y: 0 }, // Body - 1 suqare from left
  { x: 0, y: 0 }, // Tail - 0 square from left
];

// This function draws the snake on the canvas
function drawSnake() {
  // Iterate over each segment of the snake
  snake.forEach((square, index) => {
    // If current index is equal to 0, headcolor is assigned,
    // if condition is false then bodyColor is assigned
    const color = index === 0 ? headColor : bodyColor;
    drawSquare(square.x, square.y, color);
  });
}

function moveSnake() {
  if (!gameStarted) return;

  // Get the head position
  const head = { ...snake[0] };

  // Consume the directions
  // Check if there are directions in the queue - If there are directions available, consume them
  if (directionsQueue.length) {
    // Remove and retrieve the first direction from the queue
    // Update the current direction with the consumed direction
    currentDirection = directionsQueue.shift();
  }

  // Change head postion
  switch (currentDirection) {
    case directions.RIGHT:
      head.x += 1;
      break;
    case directions.LEFT:
      head.x -= 1;
      break;
    case directions.UP:
      head.y -= 1;
      break;
    case directions.DOWN:
      head.y += 1;
      break;
  }

  if (hasEatenFood()) {
    food = createFood();
  } else {
    // Remove tail
    snake.pop();
  }

  // Unshift new head
  snake.unshift(head);
}

function hasEatenFood() {
  const head = snake[0];
  return head.x === food.x && head.y === food.y;
}

// Add event listener to the document for the 'keyup' event.
// When a 'keyup' event occurs (when a key is released), the setDirection function is called
document.addEventListener('keyup', setDirection);
function setDirection(event){
  // Get the key that was released and assign it to the 'newDirection' variable
  const newDirection = event.key;
  // Capture the current direction before any changes
  const oldDirection = currentDirection;

  // Check if the new direction is valid based on the old direction
  if (
    // New direction is left and old direction is not right
    (newDirection === directions.LEFT && oldDirection !== directions.RIGHT) ||
    (newDirection === directions.RIGHT && oldDirection !== directions.LEFT) ||
    (newDirection === directions.UP && oldDirection !== directions.DOWN) ||
    (newDirection === directions.DOWN && oldDirection !== directions.UP)
  ) {
    if (!gameStarted) { // If game has not started 
      gameStarted = true; // Set gameStarted to true to indicate that game has started
      // Start the game loop by calling the frame function at the specified FPS interval
      gameLoop = setInterval(frame, FPS);
    }
    // Add the new direction to the direction queue
    directionsQueue.push(newDirection);
  }
}

// Number of Vertical/Horizontal squares
const horizontalSq = width / squareSize; // 400/20 => 20
const verticalSq = height / squareSize;

// FOOD
// Initialize the food object by calling the createFood() function
let food = createFood();

function createFood() { // Create the food object with random coordinates
  let food = {
    x : Math.floor(Math.random() * horizontalSq),
    y : Math.floor(Math.random() * verticalSq),
  };

  // Check if the randomly generated food coordinates collide with any snake segment
  while (
    snake.some((square) => square.x === food.x && square.y === food.y)
  ) {
    // If collision occurs, generate new random coordinates for the food object
    food = {
      x: Math.floor(Math.random() * horizontalSq),
      y: Math.floor(Math.random() * verticalSq),
    };
  }
  return food;
}

// Draw the food on the canvas - light purple
function drawFood() {
  drawSquare(food.x, food.y, '#DE73FF');
}

// Score
const initialSnakeLength = snake.length; // Always at 3
let score = 0;
let highScore = localStorage.getItem('high-score') || 0;

function renderScore() {
  score = snake.length - initialSnakeLength;
  scoreEl.innerHTML = `🌟: ${score}`;
  highScoreEl.innerHTML = `🏆: ${highScore}`;
}

// Hit wall
function hitWall(){
  const head = snake[0];

  return (
    head.x < 0 || head.x >= horizontalSq || head.y < 0 || head.y >= verticalSq
  );
}

// Hit self
function hitSelf() {
  const snakeBody = [...snake];
  // Get the head of the snake by removing the first element from the copied snakeBody array.
  const head = snakeBody.shift();

  return snakeBody.some(
    (square) => square.x === head.x && square.y === head.y
  );
}

// Game Over
function gameOver() {
  // Select score and high score element
  const scoreEl = document.querySelector('.game-over-score .current');
  const highScoreEl = document.querySelector('.game-over-score .high');

  // calculate the high score
  highScore = Math.max(score, highScore);
  localStorage.setItem('high-score', highScore);

  // Update score and high score element 
  scoreEl.innerHTML = `🌟: ${score}`;
  highScoreEl.innerHTML = `🏆: ${highScore}`;

  // Show game over screen
  gameOverEl.classList.remove('hide');
}

// Loop
function frame() {

  drawBoard();
  drawFood();
  moveSnake();
  drawSnake();
  renderScore();

// Checks if the function hitWall() returns true or the function hitSelf() returns true.
  if (hitWall() || hitSelf()) {

    // If either condition is true, the interval is cleared using clearInterval() 
    // and the game loop is stopped.
    clearInterval(gameLoop);

    // Calls the gameOver() function.
    gameOver();
  }
}
frame();

// Restart the game
playAgainBtn.addEventListener('click', restartGame);
function restartGame() {
  // reset snake length and position
  snake = [
    { x: 2, y: 0 }, // Head - 2 square from left
    { x: 1, y: 0 }, // Body - 1 suqare from left
    { x: 0, y: 0 }, // Tail - 0 square from left
  ];

  // Reset directions
  currentDirection = '';
  directionsQueue = [];

  // hide the game over screen
  gameOverEl.classList.add('hide');

  // Reset the gameStarted state to false
  gameStarted = false;

  // re-draw everything
  frame();
}