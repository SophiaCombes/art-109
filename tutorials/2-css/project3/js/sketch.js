
let flowers = [];


let currentFlowerType = 1;


function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    angleMode(DEGREES);
    noStroke();
}

function draw() {
    // background(173, 142, 118);
      clear();


    for (let i = 0; i < flowers.length; i++) {
        let f = flowers[i];


        f.currentScale = lerp(f.currentScale, f.targetScale, 0.1);

        push();
        translate(f.x, f.y);
        scale(f.currentScale);


        let outerColor = color(f.r, f.g, f.b, 180);
        let innerColor = color(255, 255, 255, 225);


        let totalLayers = 15;
        for (let layer = 0; layer < totalLayers; layer++) {

            let progress = layer / (totalLayers - 1);

            let currentGradientColor = lerpColor(outerColor, innerColor, progress);
            fill(currentGradientColor);


            let currentPetalScale = 1.0 - (progress * 0.85);

            push();
            scale(currentPetalScale);
            drawPetals(f.type);
            pop();
        }

        pop();
    }


    drawUI();
}


function drawPetals(type) {
    if (type === 1) {
        let numPetals = 8;
        for (let j = 0; j < numPetals; j++) {
            ellipse(0, -20, 30, 60);
            rotate(360 / numPetals);
        }
    }
    else if (type === 2) {
        let numPetals = 12;
        for (let j = 0; j < numPetals; j++) {
            ellipse(0, -20, 30, 50);
            rotate(360 / numPetals);
        }
    }
    else if (type === 3) {
        let numPetals = 16;
        for (let j = 0; j < numPetals; j++) {
            ellipse(0, -30, 10, 70);
            rotate(360 / numPetals);
        }
    }
}

function mousePressed() {
    let baseR, baseG, baseB;


    if (currentFlowerType === 1) {
        baseR = 210; baseG = 240; baseB = 189; // Green
    } else if (currentFlowerType === 2) {
        baseR = 255; baseG = 217; baseB = 233; // Pink
    } else if (currentFlowerType === 3) {
        baseR = 255; baseG = 235; baseB = 100; // Yellow
    }


    let variation = 20;
    let randomR = baseR + random(-variation, variation);
    let randomG = baseG + random(-variation, variation);
    let randomB = baseB + random(-variation, variation);


    flowers.push({
        x: mouseX,
        y: mouseY,
        type: currentFlowerType,
        r: randomR,
        g: randomG,
        b: randomB,
        currentScale: 0.0,
        targetScale: 1.0
    });
}

function keyPressed() {
    if (key === '1') {
        currentFlowerType = 1;
    } else if (key === '2') {
        currentFlowerType = 2;
    } else if (key === '3') {
        currentFlowerType = 3;
    }
}

function drawUI() {
    fill(255);
    textStyle(BOLD);
    textSize(25);
    textAlign(LEFT, TOP);
    let currentName = currentFlowerType === 1 ? "Green" : currentFlowerType === 2 ? "Pink" : "Yellow";
    text("Press keys 1, 2, or 3 to swap flower types.", 20, 20);
    text("Selected: " + currentName, 20, 40);
}
