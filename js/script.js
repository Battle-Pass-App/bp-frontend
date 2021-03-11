// grab canvas reference by id
const canvas = document.getElementById('canvas')

// get the context, allows us to draw on canvas
const ctx = canvas.getContext('2d')


// constants
const netWidth = 4;
const netHeight = canvas.height;

const paddleWidth = 10;
const paddleHeight = 100;

let upArrowPressed = false;
let downArrowPressed = false;


// objects
// net
const net = {
  x: canvas.width / 2 - netWidth / 2,
  y: 0,
  width: netWidth,
  height: netHeight,
  color: "#FFF" // white
};

// user paddle
const user = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: '#FFF', // white
  score: 0
};

// ai paddle
const ai = {
    x: canvas.width - (paddleWidth + 10),
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#FFF', // white
    score: 0
  };
  
// ball
const ball = {
x: canvas.width / 2,
y: canvas.height / 2,
radius: 7,
speed: 7,
velocityX: 5,
velocityY: 5,
color: '#05EDFF' // light blue
};


// draw functions

// draws net
function drawNet() {
    // net is global const
    ctx.fillStyle = net.color // fill net color
    ctx.fillRect(net.x, net.y, net.width, net.height)
}

// draw score (for either team)
function drawScore(x, y, score) {
    ctx.fillStyle = '#fff'
    ctx.font = '35px sans-serif'
    ctx.fillText(score, x, y) // text and x y location to draw
}

// draw paddle (for either team)
function drawPaddle(x, y, width, height, color) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
}

// draw ball
function drawBall(x, y, radius, color) {
    ctx.fillStyle = color
    ctx.beginPath()
    // arc has complex params: arc(x, y, radius, startAngle, endAngle, antiClockwise_or_not)
    ctx.arc(x, y, radius, 0, Math.PI * 2, true) // pi = 1 radian = 180 degrees, 360 makes circle
    ctx.closePath()
    ctx.fill()
}

// render the canvas updates
function render() {
    ctx.fillStyle = "#000" // all below gets filled with black
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.height)

    drawNet()
    drawScore(1/4 * canvas.width, 1/6 * canvas.height, user.score)
    drawScore(3/4 * canvas.width, 1/6 * canvas.height, ai.score)
    drawPaddle(user.x, user.y, user.width, user.height, user.color)
    drawPaddle(ai.x, ai.y, ai.width, ai.height, ai.color)
    drawBall(ball.x, ball.y, ball.radius, ball.color)
}

render()