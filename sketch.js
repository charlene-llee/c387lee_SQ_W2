// ============================================================
// Week 2 Example 1: Movement, Gravity, and Collision
// ============================================================

// Photo by Namocchi [1]
let celestebgIMG;
// Photo by PNG Play [2]
let strawberryIMG;

let platforms = [
  { x: 400, y: 150, w: 60, h: 20, icy: true },
  { x: 550, y: 60, w: 60, h: 20, icy: false },
  { x: 400, y: 350, w: 300, h: 20, icy: true },
  { x: 200, y: 250, w: 150, h: 20, icy: false },
  { x: 800, y: 300, w: 150, h: 20, icy: false },
];

let player = {
  x: 200,
  y: 100,

  vx: 0,
  vy: 0,

  r: 24,

  speed: 0.5,
  maxSpeed: 4,
  jumpForce: -12,
  friction: 0.8,

  onGround: false,
  onIce: false,
};

const GRAVITY = 0.6;

let blobT = 0;

let floorY;

function preload() {
  celestebgIMG = loadImage("assets/images/celestebgIMG.png");
  strawberryIMG = loadImage("assets/images/strawberryIMG.png");
}

function setup() {
  createCanvas(1200, 450);
  floorY = height - 40;
  player.y = floorY - player.r;
}

function draw() {
  background(celestebgIMG);

  drawFloor();
  drawPlatform();
  handleInput();
  applyPhysics();
  drawPlayer();
  drawHUD();

  blobT += 0.015;
}

function handleInput() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.vx -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.vx += player.speed;
  }

  player.vx = constrain(player.vx, -player.maxSpeed, player.maxSpeed);

  if (
    !keyIsDown(LEFT_ARROW) &&
    !keyIsDown(65) &&
    !keyIsDown(RIGHT_ARROW) &&
    !keyIsDown(68)
  ) {
    let currentFriction = player.onIce ? 1.5 : player.friction;

    if (
      !keyIsDown(LEFT_ARROW) &&
      !keyIsDown(65) &&
      !keyIsDown(RIGHT_ARROW) &&
      !keyIsDown(68)
    ) {
      player.vx *= currentFriction;
    }
  }

  if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && player.onGround) {
    player.vy = player.jumpForce;
    player.onGround = false;
  }
}

function applyPhysics() {
  player.vy += GRAVITY;

  player.x += player.vx;
  player.y += player.vy;

  player.onGround = false;

  if (player.y + player.r >= floorY) {
    player.y = floorY - player.r;
    player.vy = 0;
    player.onGround = true;
  }

  player.onIce = false;

  for (let p of platforms) {
    if (
      player.x > p.x &&
      player.x < p.x + p.w &&
      player.y + player.r >= p.y &&
      player.y + player.r <= p.y + p.h &&
      player.vy >= 0
    ) {
      player.y = p.y - player.r;
      player.vy = 0;
      player.onGround = true;

      if (p.icy) {
        player.onIce = true;
      }
    }
  }

  player.x = constrain(player.x, player.r, width - player.r);
}

function drawPlayer() {
  push();

  imageMode(CENTER);

  image(strawberryIMG, player.x, player.y, player.r * 2, player.r * 2);

  pop();
}

function drawFloor() {
  fill(40, 120, 110); // dark teal
  noStroke();
  rect(0, floorY, width, height - floorY);
}

function drawPlatform() {
  noStroke();

  for (let p of platforms) {
    if (p.icy) {
      fill(0, 187, 255); // icy blue
    } else {
      fill(40, 120, 110); // normal
    }

    rect(p.x, p.y, p.w, p.h);
  }
}

// ------------------------------------------------------------
// drawHUD()
// HUD = Heads Up Display.
// Shows controls on screen so the player always knows
// how to interact without needing external instructions.
// ------------------------------------------------------------
function drawHUD() {
  fill(180);
  noStroke();
  textSize(13);
  textAlign(LEFT);
  text("Move: Arrow Keys or WASD   Jump: W or Up Arrow", 16, 24);
}
