// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const para = document.querySelector('p');


// function to generate random number

function random(min, max) {
	const num = Math.floor(Math.random() * (max - min + 1)) + min;
	return num;
}


// Modelling a ball in our program
function Shape(x, y, velX, velY, exists) {
	this.x = x;
	this.y = y;
	this.velX = velX;
	this.velY = velY;
	// this.color = color;
	// this.size = size;
	this.exists = exists;
}

function Ball(x, y, velX, velY, exists, color, size) {
	Shape.call(this, x, y, velX, velY, exists)

	this.color = color;
	this.size = size;
}

// Setting Ball()'s prototype and constructor reference
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball; 


// ------------ Ball Methods ------------
Ball.prototype.draw = function() {
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
	ctx.fill();
}

// Updating the ball's data
Ball.prototype.update = function() {
	// if the x coordinate is greather than the width of the canvas 
	// (the ball is going off the right edge). 
	if ((this.x + this.size) >= width) {
		this.velX = -(this.velX);  // <- reverse velocity
	}

	if ((this.x - this.size) <= 0) {
		this.velX = -(this.velX);
	}

	if ((this.y + this.size) >= height) {
		this.velY = -(this.velY);
	}

	if ((this.y - this.size) <= 0) {
		this.velY = -(this.velY);
	}
	// In each case, we include the size of the ball in the
	// calculation b'cos the x/y coordinates are in the 
	// center of the ball, but we want the edge of the
	// ball to bounce off the perimeter - we don't want the 
	// ball to go halfway off the screen before it starts
	// to bounce back.

	this.x += this.velX;
	this.y += this.velY;
	// these last two lines add the velX value to the x coordinate,
	// and the velY value to the y coordinate - the ball is in 
	// effect moved each time this method is called. 
}

// ADDING COLLISION DETECTION
Ball.prototype.collisionDetect = function() {
	for (let j = 0; j < balls.length; j++) {
		if (!(this === balls[j]) && balls[j].exists) {
			const dx = this.x - balls[j].x;
			const dy = this.y - balls[j].y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < this.size + balls[j].size) {
				balls[j].color = this.color = 'rgb(' + random(0, 255) 
					+ ',' + random(0, 255) + ',' + random(0, 255) +')';
			}
		}
	}
}

// -----------------------------------------------

// Defining EvilCircle
function EvilCircle(x, y, exists) {
	Shape.call(this, x, y, 20, 20, exists);

	this.color = 'white';
	this.size = 10;
}

// Setting EvilCircle()'s prototype and constructor reference
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

// ------------ Evil Circle Methods ------------
EvilCircle.prototype.draw = function() {
	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.strokeStyle = this.color;
	ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
	ctx.stroke();
}

EvilCircle.prototype.checkBounds = function() {
	
	if ((this.x + this.size) >= width) {
		// this.velX = -(this.velX);  <- instead of reversing  velocity
		this.x -= this.size;
	}

	if ((this.x - this.size) <= 0) {
		// this.velX = -(this.velX);
		this.x += (this.size)
	}

	if ((this.y + this.size) >= height) {
		// this.velY = -(this.velY);
		this.y -= this.size;
	}

	if ((this.y - this.size) <= 0) {
		// this.velY = -(this.velY);
		this.y += this.size;
	}
	
}

EvilCircle.prototype.setControls = function() {
	let _this = this;
	// IMPORTANT: 
	// why this? to _this? (has something to do with function scope)

	window.onkeydown = function(e) {
		if (e.key === 'a') {
			_this.x -= _this.velX;
		} else if (e.key === 'd') {
			_this.x += _this.velX;
		} else if (e.key === 'w') {
			_this.y -= _this.velY;
		} else if (e.key === 's') {
			_this.y += _this.velY;
		}
	}
}

EvilCircle.prototype.collisionDetect = function() {
	for (let j = 0; j < balls.length; j++) {
		if (balls[j].exists) {
			const dx = this.x - balls[j].x;
			const dy = this.y - balls[j].y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < this.size + balls[j].size) {
				balls[j].exists = false;
				count--;
			}
		}
	}
}
// -----------------------------------------------




// Animating the ball
let balls = [];


while (balls.length < 25) {
	let size = random(10, 20);
	let ball = new Ball(
		// ball position always drawn at least one ball width
		// away from the edge of the canvas, to avoid errors. 
		random(0 + size, width - size),
		random(0 + size, height - size),
		random(-7, 7),
		random(-7, 7),
		true,				// changed constructor parameter list - clue: balls were really small
		'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
		size,
	);

	balls.push(ball);
}

let count = balls.length;
let size = random(10, 20);

let evilBall = new EvilCircle(
	random(0 + size, width - size),
	random(0 + size, height - size),
	true
);
evilBall.setControls();


function loop() {

	ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
	ctx.fillRect(0, 0, width, height);

	for (let i = 0; i < balls.length; i++) {
		if (balls[i].exists) {
			balls[i].draw();
			balls[i].update();
			balls[i].collisionDetect();
		}	
	}
	evilBall.draw();
	evilBall.checkBounds();
	evilBall.collisionDetect();

	para.textContent = `Ball Count: ${count}`;

	requestAnimationFrame(loop);
}

loop();
