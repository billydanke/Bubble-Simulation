var canvas = document.getElementById('main');
var ctx = canvas.getContext('2d');

var bubbleList = [];
var mousePosX = 0;
var mousePosY = 0;

function sizeScreen(e) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function distance(x1,y1, x2,y2) {
    return Math.sqrt(Math.pow(y2-y1,2) + Math.pow(x2-x1,2));
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

canvas.addEventListener('resize', sizeScreen());
canvas.addEventListener('mousemove', function(e) {
    mousePos = getMousePos(canvas,e);
    mousePosX = mousePos.x;
    mousePosY = mousePos.y;
});

function Bubble(x,y,baseRadius, bigRadius, velX, velY) {
    this.x = x;
    this.y = y;
    this.baseRadius = baseRadius;
    this.radius = baseRadius;
    this.bigRadius = bigRadius;
    this.velX = velX;
    this.velY = velY;
    this.destroy = false;

    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(100, 200, 255, 0.5)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    }

    this.update = function() {
        // Move the bubbles
        this.x += this.velX;
        this.y += this.velY;

        // Check if close to mouse
        distanceToBubble = distance(this.x,this.y, mousePosX,mousePosY);

        if(distanceToBubble < this.radius) {
            // Mark Bubble for deletion
            this.destroy = true;
        }

        // Do boundary check
        if(this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
            this.velX = -this.velX;
        }
        if(this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
            this.velY = -this.velY;
        }
    }
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i=0; i < bubbleList.length; i++) {
        bubbleList[i].draw();
    }
}

function loop() {
    // Run through all bubbles and scale them according to how close they are to the mouse

    for(var i=0; i < bubbleList.length; i++) {
        bubbleList[i].update();
        if(bubbleList[i].destroy) {
            bubbleList.splice(i,1);
        }
    }

    draw();

    requestAnimationFrame(loop);
}

function init() {
    // Create bubbles with random velocities
    for(var i=0; i < 50; i++) {
        bubbleList.push(new Bubble(25 + Math.random() * canvas.width - 50, 25 + Math.random() * canvas.height - 50,Math.random() * 15 + 10,50,Math.random() * 3 + 0.1,Math.random() * 3 + 0.1));
    }

    loop();
}

init();