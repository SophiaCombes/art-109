
var socket;

function setup() {
    createCanvas(400, 400);
    background(0);

    socket = io.connect('http://localhost:3000');


    socket.on('mouse',
        function (data) {
            console.log("Got: " + data.x + " " + data.y);
            fill(0, 0, 255);
            noStroke();
            ellipse(data.x, data.y, 20, 20);
        }
    );
}

function draw() {
    // noStroke();
    // Fill(255);
    // ellipse(mouseX, mouseY, 36, 36);

}