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
let enterButtonPressed = false;

// modify
let allowModifications = true
let modification = false

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

// listen for button press (dont have button defined yet)
window.addEventListener('keydown', keyDownHandler)
window.addEventListener('keyup', keyUpHandler)

function keyDownHandler(event) {
    switch (event.keyCode) {
        // up arrow key is 38
        case 38:
            upArrowPressed = true
            break
        case 40:
            downArrowPressed = true
            break
        case 13:
            enterButtonPressed = true
            break
        case 49:
            modification = 'bouncy gravity'
            break
        case 50:
            modification = 'random'
            break
        case 51:
            modification = 'grow shrink'
            break
        case 48:
            modification = false
            modReset()
            break

            
    }
}

function keyUpHandler(event) {
    switch (event.keyCode) {
        // up arrow key is 38
        case 38:
            upArrowPressed = false
            break
        case 40:
            downArrowPressed = false
            break
    }
}

function modify(flag) {
    switch (flag) {
        case 'bouncy gravity':
            ball.velocityY += 0.5
            break
        case 'random':
            if (Math.random() <= 0.30) {
                ball.velocityY += Math.random() * 2 - 1
                ball.velocityX += Math.random() * 2 - 1
                //ball.speed += Math.random() * 2 - 1
            } break
        case 'grow shrink':
            if (ball.radius <= 2) {
                ball.radius = 2 + Math.random() + 0.1
            } else if (ball.radius >= 20) {
                ball.radius = 20 - Math.random() - 0.1
            } else {
                ball.radius += Math.random() * 2 - 1
            } break
    }
}

// reset ball
function modReset() {
    ball.radius = 7
    ball.speed = 7
}

// update the game state
function update() {
    // move paddle
    if (upArrowPressed && user.y > 0) {
        user.y -= 8
    } else if (downArrowPressed && (user.y < canvas.height - user.height)) {
        user.y += 8
    }

    // check if ball hits top or bottom
    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
        // play a wall hit sound
        ball.velocityY = -ball.velocityY
    }

    // check if ball hits right wall
    if (ball.x + ball.radius >= canvas.width) {
        // play scoreSound
        // then user scored 1 point
        user.score += 1;
        reset()
    }

    // if ball hit on left wall
    if (ball.x - ball.radius <= 0) {
        // play scoreSound
        // then ai scored 1 point
        ai.score += 1
        reset()
    }

    // move the ball
    ball.x += ball.velocityX
    ball.y += ball.velocityY

    if (allowModifications && modification) {
        modify(modification)
    }

    // ai paddle movement
    ai.y += ((ball.y - (ai.y + ai.height / 2))) * 0.09

    // collision detechtion on paddles
    // select player that has the ball on their side
    let player = (ball.x < canvas.width / 2) ? user: ai
    if (collisionDetect(player, ball)) {
        // play hit sound
        let angle = 0
        // if ball hit the top of the paddle
        if (ball.y < (player.y + player.height / 2)) {
            // then -1 * Math.PI / 4 = -45 degrees
            angle = -1 * Math.PI/4
        } else if (ball.y > (player.y + player.height /2)) {
            // if hit the bottom of paddle
            angle = 1 * Math.PI/4
        }
        // hit side
        ball.velocityX = (player == user ? 1 : -1) * ball.speed * Math.cos(angle)
        ball.velocityY = ball.speed * Math.sin(angle)

        // increase ball speed after hit
        ball.speed += 0.2
    } 
}

function reset() {
    // reset balls value to older values
    // TODO: move objects to classes so can just instantiate a new ball instead of modifying orig
    ball.x = canvas.width / 2
    ball.y = canvas.height /2
    ball.speed = 7
    // reverse velocity to other side
    ball.velocityX = -5 * Math.sign(ball.velocityX)
    ball.velocityY = -5 * Math.sign(ball.velocityY)
}

function collisionDetect(player, ball) {
    // returns true or false
    player.top = player.y
    player.right = player.x + player.width
    player.bottom = player.y + player.height
    player.left = player.x

    ball.top = ball.y - ball.radius
    ball.right = ball.x + ball.radius
    ball.bottom = ball.y + ball.radius
    ball.left = ball.x - ball.radius
    return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top
}

// game loop (ie update the game state and then render the changes on the screen)
function gameLoop() {
    if (enterButtonPressed) {
        update()
        render()
    }
    else {
        render()
    }
}

// call the gameLoop function 60 times per second
setInterval(gameLoop, 1000 / 60)
