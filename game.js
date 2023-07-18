// GLOBALS

let canvas;
let canvasContext;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;

let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 3;

let showingWinScreen = false;

let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

// -------------------------------------------------------------------
/**
 * Calculates the mouse position relative to the canvas element.
 * @param {MouseEvent} evt - The mouse event object containing information about the event.
 * @returns {Object} An object with the x and y coordinates of the mouse position.
 * @property {number} x - The x-coordinate of the mouse position relative to the canvas.
 * @property {number} y - The y-coordinate of the mouse position relative to the canvas.
 */
function calculateMousePos(evt) {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = evt.clientX - rect.left - root.scrollLeft;
  let mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

// -------------------------------------------------------------------

/**
 * Handles the mouse click event and resets scores and state if the game is in the "win screen" state.
 * @param {MouseEvent} evt - The mouse event object containing information about the event.
 * @returns {undefined}
 */
function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

// -------------------------------------------------------------------

/**
 * Function executed when the window and its content finish loading.
 * Sets up the game canvas, defines the game loop, and adds event listeners for mouse input.
 * @returns {undefined}
 */
window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  let framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousedown", handleMouseClick);

  canvas.addEventListener("mousemove", function (evt) {
    let mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

// -------------------------------------------------------------------

/**
 * Resets the position and speed of the ball and checks if the game has reached the winning score.
 * If the winning score is reached by either player, the game enters the "win screen" state.
 * @returns {undefined}
 */
function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

// -------------------------------------------------------------------

/**
 * Controls the movement of the computer-controlled paddle based on the position of the ball.
 * The function adjusts the vertical position of the computer paddle to try to align it with the vertical position of the ball.
 * @returns {undefined}
 */
function computerMovement() {
  let paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y = paddle2Y + 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y = paddle2Y - 6;
  }
}

// -------------------------------------------------------------------
/**
 * Updates the game state by moving the ball, handling collisions, and updating scores.
 * If the game is in the "win screen" state, the function returns without making any changes.
 * @returns {undefined}
 */
function moveEverything() {
  if (showingWinScreen) {
    return;
  }

  computerMovement();

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++; // must be BEFORE ballReset()
      ballReset();
    }
  }
  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++; // must be BEFORE ballReset()
      ballReset();
    }
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

// -------------------------------------------------------------------

/**
 * Draws the net in the middle of the canvas.
 * The net consists of vertical lines evenly spaced along the canvas height.
 * @returns {undefined}
 */
function drawNet() {
  for (let i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
  }
}

// -------------------------------------------------------------------

/**
 * Draws the game elements on the canvas, including the background, paddles, ball, net, and scores.
 * If the game is in the "win screen" state, it displays the winning player's name and a prompt to continue.
 * @returns {undefined}
 */
function drawEverything() {
  // next line blanks out the screen with black
  colorRect(0, 0, canvas.width, canvas.height, "black");

  if (showingWinScreen) {
    canvasContext.fillStyle = "white";

    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText("Left Player Won", 350, 200);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText("Right Player Won", 350, 200);
    }

    canvasContext.fillText("click to continue", 350, 500);
    return;
  }

  drawNet();

  // this is left player paddle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");

  // this is right computer paddle
  colorRect(
    canvas.width - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "white"
  );

  // next line draws the ball
  colorCircle(ballX, ballY, 10, "white");

  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

// -------------------------------------------------------------------

/**
 * Draws a filled circle on the canvas with the specified center coordinates, radius, and color.
 * @param {number} centerX - The x-coordinate of the center of the circle.
 * @param {number} centerY - The y-coordinate of the center of the circle.
 * @param {number} radius - The radius of the circle.
 * @param {string} drawColor - The color to fill the circle with.
 * @returns {undefined}
 */
function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

// -------------------------------------------------------------------

/**
 * Draws a filled rectangle on the canvas with the specified position, dimensions, and color.
 * @param {number} leftX - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} topY - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 * @param {string} drawColor - The color to fill the rectangle with.
 * @returns {undefined}
 */
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

// -------------------------------------------------------------------
