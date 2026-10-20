
let canvas; 

function setup(){
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style("z-index", -2);
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

// function draw(){
    // background(125);

//     strokeWeight(0);
//     fill(random(200, 255), random(200, 255), random(200, 255));
//     ellipse(mouseX, mouseY, 30, 30);
// }

// function mouseMoved(){
//     drawThing();
// }

// function drawThing(){
//     strokeWeight(0);
//     fill(random(200, 255), random(200, 255), random(200, 255));
//     ellipse(mouseX, mouseY, 30, 30);
// }


// function setup() {
// //   createCanvas(400, 400);
// //   background(220);
//   star(mouseX, mouseY, 10, 20, 5);
// }

function mouseMoved(){
  for (let i = 0; i < 3; i++) {
    let sizeVariation = random(0.1, 0.5);
    let angleVariation = random(0, TWO_PI);

    let offsetX = random(-30, 30); 
    let offsetY = random(-30, 30);
    let targetX = mouseX + offsetX;
    let targetY = mouseY + offsetY;

    push(); 
      translate(targetX, targetY);
      rotate(angleVariation);
      scale(sizeVariation);
      noStroke();


     fill(random(200, 255), random(200, 255), random(200, 255));
      star(0, 0, 10, 20, 5); 
    pop(); 
  }

    
}


function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

