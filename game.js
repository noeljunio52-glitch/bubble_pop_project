/* =====================================================================
   CC104 – Data Structures and Algorithms
   Project 5: Bubble Pop Challenge

   DATA STRUCTURE : an ARRAY OF OBJECTS called `bubbles`
                    each bubble = { id, face, size, x, y }
   ALGORITHMS     : traversal  (grow every bubble each tick)
                    searching  (find the clicked bubble by its id)
                    filtering  (remove popped / burst bubbles)
                    repeated updates (a timer runs the game loop)
   ===================================================================== */

/* ---------------------------- Settings ---------------------------- */
const AREA_W = 320;            // game area size in pixels
const AREA_H = 420;
const START_SIZE_MIN = 36;     // a new bubble starts between these sizes
const START_SIZE_MAX = 46;
const MAX_SIZE = 90;           // a bubble bigger than this bursts by itself
const GROW_PER_TICK = 1;       // how much every bubble grows each tick
const TICK_MS = 100;           // length of one tick
const SPAWN_EVERY_TICKS = 15;  // a new bubble every 15 ticks (1.5 seconds)
const POINTS_PER_POP = 10;
const START_LIVES = 3;

// Each bubble shows one of these face pictures (replace the files in assets/faces to change them)
const FACES = [
  "assets/faces/face1.jpg",
  "assets/faces/face2.jpg",
  "assets/faces/face3.jpg"
];

/* ---------------------------- Game state -------------------------- */
let bubbles = [];              // the array of bubble objects
let nextId = 1;                // gives every bubble a unique id
let score = 0;
let lives = START_LIVES;
let ticks = 0;
let gameOver = false;
let timerId = null;

/* ---------------------------------------------------------------------
   HELPERS
   --------------------------------------------------------------------- */

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

/* ---------------------------------------------------------------------
   ARRAY OPERATIONS
   --------------------------------------------------------------------- */

/* ADD: create a bubble object at a random position and push it into the array.
   The centre is kept far enough from the edges that, even at MAX_SIZE,
   the bubble stays inside the game area. */
function spawnBubble() {
  const half = MAX_SIZE / 2 + 2;
  const bubble = {
    id: nextId,
    face: Math.floor(Math.random() * FACES.length),   // which picture this bubble shows
    size: Math.round(randomBetween(START_SIZE_MIN, START_SIZE_MAX)),
    x: Math.round(randomBetween(half, AREA_W - half)),
    y: Math.round(randomBetween(half, AREA_H - half))
  };
  nextId++;
  bubbles.push(bubble);
}

/* TRAVERSAL: visit every active bubble and make it bigger. */
function growBubbles() {
  bubbles.forEach(function (b) {
    b.size += GROW_PER_TICK;
  });
}

/* SEARCH: find a bubble by its id (returns undefined if it is not there). */
function findBubble(id) {
  return bubbles.find(function (b) { return b.id === id; });
}

/* REMOVE (player pops it): search by id, filter it out, award points. */
function popBubble(id) {
  if (gameOver) return;                       // guard: no popping after game over
  const bubble = findBubble(id);              // searching
  if (bubble === undefined) return;           // guard: bubble is already gone

  bubbles = bubbles.filter(function (b) { return b.id !== id; });   // removal
  score += POINTS_PER_POP;
  showMessage("Pop! +" + POINTS_PER_POP + " points.", "success");
  render();
}

/* REMOVE (too big): any bubble larger than MAX_SIZE bursts, and the player loses a life each. */
function burstOversizeBubbles() {
  const burst = bubbles.filter(function (b) { return b.size > MAX_SIZE; });   // searching/filtering
  if (burst.length === 0) return;

  bubbles = bubbles.filter(function (b) { return b.size <= MAX_SIZE; });      // removal
  lives -= burst.length;
  if (lives < 0) lives = 0;

  flashArea();
  if (lives === 0) {
    endGame();
  } else {
    showMessage("A bubble burst! Lives left: " + lives, "warning");
  }
}

/* ---------------------------------------------------------------------
   GAME LOOP (repeated updates)
   --------------------------------------------------------------------- */

function tick() {
  if (gameOver) return;
  ticks++;

  growBubbles();                 // 1. grow every bubble
  burstOversizeBubbles();        // 2. burst the ones that are too big (may end the game)

  if (!gameOver && ticks % SPAWN_EVERY_TICKS === 0) {
    spawnBubble();               // 3. add a new bubble now and then
  }
  render();
}

function endGame() {
  gameOver = true;
  clearInterval(timerId);
  $("#area").addClass("over");
  showMessage("Game over! Final score: " + score + ". Press Reset to play again.", "danger");
}

function resetGame() {
  clearInterval(timerId);
  bubbles = [];
  nextId = 1;
  score = 0;
  lives = START_LIVES;
  ticks = 0;
  gameOver = false;
  $("#area").removeClass("over hit").empty();
  spawnBubble();                 // start with one bubble
  showMessage("Click the bubbles to pop them before they burst!", "info");
  render();
  timerId = setInterval(tick, TICK_MS);
}

/* ---------------------------------------------------------------------
   DISPLAY (jQuery updates the page from the array)
   --------------------------------------------------------------------- */

function render() {
  const $area = $("#area");

  // Create or update one element for every bubble in the array.
  bubbles.forEach(function (b) {
    let $b = $("#bubble-" + b.id);
    if ($b.length === 0) {
      $b = $("<button>", { type: "button", "class": "bubble", id: "bubble-" + b.id, "data-id": b.id, "aria-label": "Bubble, click to pop" })
        .appendTo($area);
      if (FACES[b.face] !== undefined) {
        $b.css("background-image", "url('" + FACES[b.face] + "')");
      }
    }
    $b.css({ width: b.size, height: b.size, left: b.x - b.size / 2, top: b.y - b.size / 2 });
    $b.toggleClass("danger", b.size > MAX_SIZE * 0.8);
  });

  // Remove elements whose bubble is no longer in the array.
  $area.children(".bubble").each(function () {
    const id = Number($(this).attr("data-id"));
    if (findBubble(id) === undefined) $(this).remove();
  });

  // Score and lives
  $("#score").text(score);
  $("#lives").text(lives > 0 ? "\u2665".repeat(lives) : "\u2013");
}

function showMessage(text, kind) {
  $("#message")
    .removeClass("alert-info alert-success alert-warning alert-danger")
    .addClass("alert-" + kind)
    .text(text);
}

function flashArea() {
  const $area = $("#area").addClass("hit");
  setTimeout(function () { $area.removeClass("hit"); }, 250);
}

/* ---------------------------------------------------------------------
   START-UP
   --------------------------------------------------------------------- */
// Load the face pictures once so bubbles appear instantly
FACES.forEach(function (src) { new Image().src = src; });

$(function () {
  $("#area").css({ width: AREA_W, height: AREA_H });

  // One click handler on the whole area; it finds which bubble was clicked.
  $("#area").on("click", ".bubble", function () {
    popBubble(Number($(this).attr("data-id")));
  });

  $("#reset-btn").on("click", resetGame);
  resetGame();
});
