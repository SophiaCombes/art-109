var socket;

function setup() {
    createCanvas(600, 400);
    background(51);

    socket = socket.io.connect('http://localhost:3000')
}

function draw() {
    noStroke();
    Fill(255);
    ellipse(mouseX, mouseY, 36, 36);

}