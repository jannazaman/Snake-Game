# Snake-Game

### Description
This game is a classic single-player Snake Game, which was built using HTML, CSS AND JavaScript. The objective of the game is simple: control the snake's movement using arrow keys, make it grow in length by consuming food, and avoid collisions with the boundaries of the game area.

### Game View
![Game ](snake-game.jpg)

## How to Play
- Use the arrow keys (up, down, left, right) to control the direction of the snake.
- Guide the snake to eat the food represented by a distinct colored square.
- Every time the snake consumes food, it will grow longer making the score increase.
- The game will come to an end when the snake hits the boundary or collides with itself.

## Key Features 
##### 1. Event Handling: The code uses event listeners to capture user input (arrow key presses) to change the snake's direction.
##### 2. Local Storage: The local storage is used to keep track of the player's high score across multiple game sessions.
##### 3. Food Generation: The createFood function generates random coordinates for the food, ensuring it does not spawn on the snake's body by repeatedly generating new coordinates until a collision-free location is found. 
##### 4. Collision Detection: The hitWall function checks if the snake's head collides with the canvas boundaries ( The game board consists of 20x20 squares, creating a 20x20 grid for the snake to move within). The hitSelf function checks if the snake's head overlaps with its body segments.

## Play the Snake Game here:
[https://master-snake-game.netlify.app/](https://master-snake-game.netlify.app/)

