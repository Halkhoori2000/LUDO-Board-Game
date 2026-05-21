# LUDO Board Game

**[▶ Play Now →](https://halkhoori2000.github.io/LUDO-Board-Game/)**

A fully playable 4-player LUDO board game that runs entirely in the browser. No install, no server — open the link and play. The board is rendered on an HTML Canvas and all game logic is implemented in vanilla JavaScript.

Four players take turns rolling a dice and moving their pieces around the 52-square path toward the home triangle. A roll of 6 is required to bring a piece out of the starting base. Landing on another player's piece sends it back to their base. First player to get all four pieces home wins; the game continues until all four finish to produce a full win order.

---

## How to Play

1. Click **Roll Dice** on your turn
2. Click a **highlighted piece** to move it by the dice value
3. Roll a **6** to bring a new piece out of base — rolling 6 gives an extra turn
4. **Land on an opponent's piece** to send it back to their base
5. Race all four pieces along the path and into the **home triangle** to win

---

## Features
- Full 4-player hot-seat multiplayer (pass the device between players)
- Complete LUDO rules: 6-to-enter, extra turn on 6, kick-out, home stretch
- Highlighted movable pieces after each dice roll
- "No moves available" detection with automatic turn skip
- Win order tracking — game continues until all four players finish
- Runs entirely in the browser — zero dependencies, no build step

---

## Tech Stack

| Item | Detail |
|---|---|
| Rendering | HTML Canvas API |
| Game Logic | Vanilla JavaScript (548 lines) |
| Styling | CSS — centred canvas layout |
| Dependencies | None |

---

## Project Structure

```
LUDO-Board-Game/
├── index.html    ← game shell + canvas element
├── script.js     ← all game logic: board, pieces, dice, turns, win
└── style.css     ← minimal layout (centred canvas)
```

---

## Run Locally

No setup needed — just open `index.html` in any browser:

```bash
git clone https://github.com/Halkhoori2000/LUDO-Board-Game.git
cd LUDO-Board-Game
open index.html
```

---

## Course

The Pennsylvania State University
