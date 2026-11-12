# Bubble Pop Challenge

**Course:** CC104 – Data Structures and Algorithms (Course Term Project, Project 5)
**Section:** BSIT WMT 2-2
**Group:** _Group XX_

## Group Members

| Name | Contribution |
|------|--------------|
| Noel D. Junio | _fill in_ |
| Joemari Matt Ogama | _fill in_ |
| Andrei Soriano | _fill in_ |
| Siantil Noelyn Lobo | _fill in_ |

## Game Objective

Bubbles (each showing a face picture) appear at random places and keep growing. Click a bubble to **pop** it and earn points before it gets too big. A bubble that grows past the maximum size **bursts by itself** and you lose a life. The game ends after **three** automatic bursts.

## Screenshots

| Gameplay | Game over | Mobile |
|---|---|---|
| ![Gameplay](assets/screenshots/gameplay.png) | ![Game over](assets/screenshots/game-over.png) | ![Mobile](assets/screenshots/mobile.png) |

## Gameplay Instructions

1. Bubbles appear in the blue game area and slowly grow. A new one appears about every 1.5 seconds.
2. Click (or tap) a bubble to pop it. It disappears and you get **10 points**.
3. Bubbles close to the maximum size get a **red ring** as a warning.
4. A bubble that grows larger than the maximum size bursts by itself: you lose one life (hearts show your lives).
5. When all **3 lives** are gone, the game is over and the bubbles can no longer be popped.
6. Press **Reset** at any time to start a new game.

## Launch Instructions

No installation, server, database or internet connection is needed.

1. Download or clone the repository (on a phone, extract the zip first or use a single-file build).
2. Open **`index.html`** in a web browser.

Bootstrap 5 (`css/bootstrap.min.css`) and jQuery 3 (`js/jquery.min.js`) are stored in the project folder so the game works offline.

## Project Structure

```
CC104-Bubble-Pop-Project/
├── index.html            page structure (Bootstrap layout)
├── css/
│   ├── bootstrap.min.css Bootstrap 5 (local copy)
│   └── style.css         dark theme and game visuals
├── js/
│   ├── jquery.min.js     jQuery 3 (local copy)
│   └── game.js           data structure + algorithms + game logic
├── assets/
│   ├── faces/            the pictures shown inside the bubbles (face1.jpg, face2.jpg, face3.jpg)
│   └── screenshots/      screenshots used in this README
└── README.md
```

## Data Structure

An **array of objects** named `bubbles` in `js/game.js`. Every active bubble is one object with an `id`, a `size`, a position (`x`, `y`) and a `face` (which picture it shows):

```js
let bubbles = [
  { id: 1, face: 0, size: 40, x: 120, y: 200 },
  { id: 2, face: 2, size: 71, x: 240, y: 90 }
];
```

## Algorithms / Operations

| Operation | What it does | Code | Function |
|---|---|---|---|
| Add (spawn) | Creates an object with a unique `id`, a random face, random start size and random position, and pushes it into the array. The position keeps the bubble inside the game area even at maximum size | `bubbles.push(bubble)` | `spawnBubble()` |
| Traversal | Visits every active bubble and increases its size | `bubbles.forEach(b => b.size += 1)` | `growBubbles()` |
| Searching | Finds the clicked bubble by its `id` | `bubbles.find(b => b.id === id)` | `findBubble()` |
| Removal (pop) | Removes the clicked bubble from the array and the screen, then adds points | `bubbles.filter(b => b.id !== id)` | `popBubble()` |
| Filtering (auto-burst) | Finds every bubble bigger than the maximum, removes them, and takes one life per burst | `bubbles.filter(b => b.size > MAX_SIZE)` | `burstOversizeBubbles()` |
| Repeated updates | A timer runs `tick()` every 0.1 seconds: grow, burst check, spawn, redraw | `setInterval(tick, 100)` | `tick()` |
| Game over | Stops the timer when lives reach 0 | `clearInterval(timerId)` | `endGame()` |

## Key Functions

- `spawnBubble()`, `growBubbles()`, `findBubble(id)`, `popBubble(id)`, `burstOversizeBubbles()` – the array operations above
- `tick()` – one step of the game loop
- `resetGame()` – clears the array, score, lives and restarts the timer
- `render()` – syncs the screen with the array using jQuery (creates, resizes or removes bubble elements; updates score and hearts)

## Error Handling (invalid actions)

- Popping a bubble that is already gone is ignored.
- After the game is over, bubbles cannot be popped and the loop is stopped.
- Bubbles are spawned only where they will fit inside the bounded game area.

## Changing the bubble pictures

The bubbles use the pictures listed in the `FACES` array at the top of `js/game.js`. To use other pictures, replace the files in `assets/faces/` with square photos (about 240×240 pixels, face in the middle) using the same file names, or add more file names to `FACES`.

## Settings you can change (top of `js/game.js`)

`FACES`, `MAX_SIZE`, `GROW_PER_TICK`, `SPAWN_EVERY_TICKS`, `POINTS_PER_POP`, `START_LIVES`

## Technologies

HTML5 · CSS3 · Bootstrap 5 · JavaScript · jQuery 3
