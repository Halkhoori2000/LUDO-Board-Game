const canvas = document.getElementById('ludo');
const ctx = canvas.getContext('2d');

// Get dimensions
const { width, height } = canvas;

// Get cell size
const cellWidth = width / 15;
const cellHeight = cellWidth;

// Define game constants here 
const colors = ['#ff0000', '#00ff00', '#ffff00', '#0000ff'];
const outline = '#000';
const clear = '#fff';
const highlightColor = '#FF8C00';
const highlightColors = ['#8b0000', '#023020', '#8B8000', '#00008b'];
const pieceSize = 0.4;
const piecePath = [
    [7.5, 0.5],
    [8.5, 0.5],
    [8.5, 1.5],
    [8.5, 2.5],
    [8.5, 3.5],
    [8.5, 4.5],
    [8.5, 5.5],
    [9.5, 6.5],
    [10.5, 6.5],
    [11.5, 6.5],
    [12.5, 6.5],
    [13.5, 6.5],
    [14.5, 6.5],
    [14.5, 7.5],
    [14.5, 8.5],
    [13.5, 8.5],
    [12.5, 8.5],
    [11.5, 8.5],
    [10.5, 8.5],
    [9.5, 8.5],
    [8.5, 9.5],
    [8.5, 10.5],
    [8.5, 11.5],
    [8.5, 12.5],
    [8.5, 13.5],
    [8.5, 14.5],
    [7.5, 14.5],
    [6.5, 14.5],
    [6.5, 13.5],
    [6.5, 12.5],
    [6.5, 11.5],
    [6.5, 10.5],
    [6.5, 9.5],
    [5.5, 8.5],
    [4.5, 8.5],
    [3.5, 8.5],
    [2.5, 8.5],
    [1.5, 8.5],
    [0.5, 8.5],
    [0.5, 7.5],
    [0.5, 6.5],
    [1.5, 6.5],
    [2.5, 6.5],
    [3.5, 6.5],
    [4.5, 6.5],
    [5.5, 6.5],
    [6.5, 5.5],
    [6.5, 4.5],
    [6.5, 3.5],
    [6.5, 2.5],
    [6.5, 1.5],
    [6.5, 0.5]
];
const pathStart = [41, 2, 15, 28];
const homePaths = [
    [[1.5, 7.5], [2.5, 7.5], [3.5, 7.5], [4.5, 7.5], [5.5, 7.5], [6.5, 7.5]],
    [[7.5, 1.5], [7.5, 2.5], [7.5, 3.5], [7.5, 4.5], [7.5, 5.5], [7.5, 6.5]],
    [[13.5, 7.5], [12.5, 7.5], [11.5, 7.5], [10.5, 7.5], [9.5, 7.5], [8.5, 7.5]],
    [[7.5, 13.5], [7.5, 12.5], [7.5, 11.5], [7.5, 10.5], [7.5, 9.5], [7.5, 8.5]]
];
const homeBase = [
    [[2, 2], [4, 2], [4, 4], [2, 4]],
    [[11, 2], [13, 2], [13, 4], [11, 4]],
    [[11, 11], [13, 11], [11, 13], [13, 13]],
    [[2, 11], [4, 11], [4, 13], [2, 13]]
];
const pieces = [];
const rollDiceBtn = {
    centerX: width / 2,
    centerY: height - 35,
    font: '16px Arial',
    width: 150,
    height: 30,
    textColor: clear,
    backColor: outline,
    text: 'Roll dice'
};

// Define game variables
const gameState = {
    currentPlayer: 0,
    repetitions: 0,
    turnState: 0,       // 0 - roll a dice, 1 - select a piece to move, 2 - no moves available
    diceValue: 0,
    playerStates: [true, true, true, true],  // true - active
    names: ['', '', '', ''],
    wins: []
};

// Build the pieces
homeBase.forEach((bases, i) => {
    bases.forEach((base, j) => {
        pieces.push({
            player: i,
            location: -1,
            index: j,
            highlight: false
        });
    });
});


// Define helper functions here 
const drawButton = ({ centerX,
    centerY,
    font,
    width,
    height,
    textColor,
    backColor,
    text }) => {

    ctx.fillStyle = backColor;
    ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);

    ctx.fillStyle = textColor;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, centerX, centerY);
}

const isButtonPressed = (x, y, { centerX, centerY, width, height }) => {
    return (centerX - width / 2) < x && x < (centerX + width / 2) && (centerY - height / 2) < y && y < (centerY + height / 2);
}

const fillRect = (fillStyle, x, y, width, height) => {
    ctx.fillStyle = fillStyle;
    ctx.fillRect(x * cellWidth, y * cellHeight, width * cellWidth, height * cellHeight);
}

const strokeRect = (strokeStyle, x, y, width, height) => {
    ctx.strokeStyle = strokeStyle;
    ctx.strokeRect(x * cellWidth, y * cellHeight, width * cellWidth, height * cellHeight);
}

const fillTrig = (fillStyle, x1, y1, x2, y2, x3, y3) => {
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(x1 * cellWidth, y1 * cellHeight);
    ctx.lineTo(x2 * cellWidth, y2 * cellHeight);
    ctx.lineTo(x3 * cellWidth, y3 * cellHeight);
    ctx.fill();
}

const strokeTrig = (strokeStyle, x1, y1, x2, y2, x3, y3) => {
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.moveTo(x1 * cellWidth, y1 * cellHeight);
    ctx.lineTo(x2 * cellWidth, y2 * cellHeight);
    ctx.lineTo(x3 * cellWidth, y3 * cellHeight);
    ctx.stroke();
}

const fillEllipse = (fillStyle, x, y, rx, ry) => {
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.ellipse(x * cellWidth, y * cellHeight, rx * cellWidth, ry * cellHeight, 0, 0, 2 * Math.PI);
    ctx.fill();
}

const fillCircle = (fillStyle, x, y, r) => {
    fillEllipse(fillStyle, x, y, r, r);
}

const strokeEllipse = (strokeStyle, x, y, rx, ry) => {
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.ellipse(x * cellWidth, y * cellHeight, rx * cellWidth, ry * cellHeight, 0, 0, 2 * Math.PI);
    ctx.stroke();
}

const strokeCircle = (strokeStyle, x, y, r) => {
    strokeEllipse(strokeStyle, x, y, r, r);
}


const drawPiece = (color, x, y, stack) => {
    fillCircle(color, x, y, pieceSize);
    strokeCircle(outline, x, y, pieceSize);

    // Draw number of stacks 
    if (stack > 1) {
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = outline;
        ctx.fillText(stack, x * cellWidth, y * cellHeight);
    }
}

const pieceLocation = ({ player, location, index }) => {
    if (location < 0) {
        // In home base
        return homeBase[player][index];
    } else if (location < piecePath.length - 1) {
        // In play
        return piecePath[(pathStart[player] + location) % piecePath.length];
    } else {
        // In goal
        const index = Math.min(homePaths[player].length - 1, location - piecePath.length + 1);
        return homePaths[player][index];
    }
}

const draw = (piece) => {
    const [x, y] = pieceLocation(piece);
    drawPiece(piece.highlight ? highlightColors[piece.player] : colors[piece.player], x, y, piece.stack);
}

const distance = (x1, y1, x2, y2) => {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

const compareLocation = (loc1, loc2) => {
    const [x1, y1] = loc1;
    const [x2, y2] = loc2;

    return x1 == x2 && y1 == y2;
}

const movePiece = (piece, steps) => {
    const newLoc = (piece.location < 0) ? 0 : piece.location + steps;
    const newLocation = pieceLocation({
        player: piece.player,
        location: newLoc,
        index: piece.index
    });

    // Update current stack 
    const currentStack = pieces.filter(pc => compareLocation(pieceLocation(piece), pieceLocation(pc)));
    currentStack.forEach(pc => {
        pc.stack = currentStack.length - 1;
    });


    // Find a piece on the new location
    const collisions = pieces.filter(pc => compareLocation(newLocation, pieceLocation(pc)));

    // Kick out another player's pieces
    piece.stack = 1;
    collisions.forEach((pc) => {
        if (pc.player != piece.player) {
            pc.location = -1;
        } else {
            // Update stack 
            piece.stack++;
        }
    });

    // Update piece location
    piece.location = newLoc;

    // Update stack of similar pieces
    collisions.forEach((pc) => {
        if (pc.player == piece.player) {
            pc.stack = piece.stack;
        }
    });
}

const isLocationBlocked = (loc, player) => {
    return pieces.filter(pc => compareLocation(loc, pieceLocation(pc)) && pc.player != player && pc.stack > 1).length > 0;
}

const isPiecemovable = ({ player, location, index }) => {
    if (gameState.currentPlayer != player) {
        return false;
    }

    if (location < 0) {
        // In home 
        return gameState.diceValue == 6;
    } else if (location < piecePath.length - 1) {
        // In play 
        for (let loc = 1; loc < gameState.diceValue; loc++) {
            if (isLocationBlocked(pieceLocation({ player: player, location: location + loc, index: index }, player))) {
                return false;
            }
        }
        return true;
    } else {
        // In goal
        return (location - piecePath.length + 1 + gameState.diceValue) == (homePaths[player].length - 1);
    }
}

const reset = () => {
    // Prompt the number of players
    const numPlayers = Number(prompt('Enter number of players'));

    // Ask for name
    for (let i = 0; i < 4; i++) {
        if (i < numPlayers) {
            gameState.names[i] = prompt(`Enter name for player ${i + 1}`);
            gameState.playerStates[i] = true;
        } else {
            gameState.playerStates[i] = false;
        }
    }

    gameState.wins.length = 0;

    // Reset the board
    pieces.forEach(pc => {
        pc.location = -1;
    })
}

const nextPlayer = () => {
    // Check if current player won 
    const homePieces = pieces.filter(pc => pc.player == gameState.currentPlayer && pc.location == piecePath.length - 1 + homePaths[gameState.currentPlayer].length - 1);
    if (homePieces.length == 4) {
        gameState.playerStates[gameState.currentPlayer] = false;
        gameState.wins.push(gameState.names[gameState.currentPlayer]);
        alert(`${gameState.names[gameState.currentPlayer]} won!`);
    }

    // Check if we need to repeat
    if (gameState.repetitions < 2 && gameState.diceValue == 6) {
        gameState.repetitions++;
        gameState.turnState = 0;
        return;
    }

    // Check if there are active players
    if (gameState.playerStates.filter(st => st).length > 0) {  
        gameState.currentPlayer = (gameState.currentPlayer + 1) % 4;
        
        // Find the next active player
        while (!gameState.playerStates[gameState.currentPlayer]) {
            gameState.currentPlayer = (gameState.currentPlayer + 1) % 4;
        }

        gameState.repetitions = 0;
        gameState.turnState = 0;
    } else {
        // Game over
        let msg = 'Game over!\nWin order:\n';

        gameState.wins.forEach(name => {
            msg += `${name}\n`;
        });

        alert(msg);
        
        // Reset board
        reset();
    }
}

// Attach handlers
const onPieceMouseDown = (piece) => {
    // Allow piece press on turn state 1
    if (gameState.turnState != 1) {
        return;
    }

    // Do nothing if pice is not highlighted 
    if (!piece.highlight) {
        return;
    }

    // Move based on dice value
    movePiece(piece, gameState.diceValue);

    // Clear movable pieces
    pieces.forEach((piece) => {
        piece.highlight = false;
    });

    // Move to next player
    nextPlayer();
}

canvas.onmousedown = (e) => {
    // Check if a piece was clicked
    pieces.forEach((piece) => {
        const [x, y] = pieceLocation(piece);

        // Piece is clicked
        if (distance(x, y, e.offsetX / cellWidth, e.offsetY / cellHeight) < pieceSize) {
            onPieceMouseDown(piece);
        }
    });

    // Move to next 
    if (gameState.turnState == 2) {
        // Move to next player
        nextPlayer();
        return;
    }

    // Check if roll dice button is pressed
    if (gameState.turnState == 0) {
        if (isButtonPressed(e.offsetX, e.offsetY, rollDiceBtn)) {
            gameState.diceValue = Math.floor(Math.random() * 6) + 1;

            // Highlight movable pieces
            pieces.forEach((piece) => {
                piece.highlight = isPiecemovable(piece);
            });

            // Count number of movable pieces
            const movablePieces = pieces.filter((piece) => piece.highlight).length;

            if (movablePieces == 0) {
                gameState.turnState += 2;
            } else {
                gameState.turnState++;
            }
        }
        return;
    }
}

// Start the game 
reset();

// Define the drawing function
window.setInterval(() => {
    // Clear rectangle 
    ctx.clearRect(0, 0, width, height);

    // Draw the game board here
    // Draw rectangle fills
    fillRect(colors[0], 0, 0, 6, 6);
    fillRect(colors[0], 1, 7, 5, 1);
    fillRect(colors[0], 1, 6, 1, 1);
    fillTrig(colors[0], 6, 6, 7.5, 7.5, 6, 9);

    fillRect(colors[1], 9, 0, 6, 6);
    fillRect(colors[1], 7, 1, 1, 5);
    fillRect(colors[1], 8, 1, 1, 1);
    fillTrig(colors[1], 6, 6, 9, 6, 7.5, 7.5);

    fillRect(colors[2], 9, 9, 6, 6);
    fillRect(colors[2], 9, 7, 5, 1);
    fillRect(colors[2], 13, 8, 1, 1);
    fillTrig(colors[2], 9, 6, 9, 9, 7.5, 7.5);

    fillRect(colors[3], 0, 9, 6, 6);
    fillRect(colors[3], 7, 9, 1, 5);
    fillRect(colors[3], 6, 13, 1, 1);
    fillTrig(colors[3], 6, 9, 7.5, 7.5, 9, 9);

    fillRect(clear, 1, 1, 4, 4);
    fillRect(clear, 10, 1, 4, 4);
    fillRect(clear, 1, 10, 4, 4);
    fillRect(clear, 10, 10, 4, 4);

    // Draw strokes
    strokeRect(outline, 0, 0, 6, 6);
    strokeRect(outline, 9, 0, 6, 6);
    strokeRect(outline, 9, 9, 6, 6);
    strokeRect(outline, 0, 9, 6, 6);

    for (let i = 6; i < 9; i++) {
        for (let j = 0; j < 6; j++) {
            strokeRect(outline, i, j, 1, 1);
            strokeRect(outline, j, i, 1, 1);
        }
    }

    for (let i = 6; i < 9; i++) {
        for (let j = 9; j < 15; j++) {
            strokeRect(outline, j, i, 1, 1);
            strokeRect(outline, i, j, 1, 1);
        }
    }

    strokeTrig(outline, 6, 6, 7.5, 7.5, 6, 9);
    strokeTrig(outline, 6, 6, 9, 6, 7.5, 7.5);
    strokeTrig(outline, 9, 6, 9, 9, 7.5, 7.5);
    strokeTrig(outline, 6, 9, 7.5, 7.5, 9, 9);

    strokeRect(outline, 1, 1, 4, 4);
    strokeRect(outline, 10, 1, 4, 4);
    strokeRect(outline, 1, 10, 4, 4);
    strokeRect(outline, 10, 10, 4, 4);

    // Draw the pieces
    pieces.forEach((piece) => {
        draw(piece);
    });

    // Draw the current player
    ctx.fillStyle = colors[gameState.currentPlayer];
    ctx.textAlign = 'center';
    ctx.font = '20px Arial';
    ctx.fillText(gameState.names[gameState.currentPlayer], width / 2, height - 70);

    // Draw the roll dice button
    if (gameState.turnState == 0) {
        drawButton(rollDiceBtn);
    }

    // Draw dice result
    if (gameState.turnState == 1 || gameState.turnState == 2) {
        drawButton({
            ...rollDiceBtn,
            text: `Dice value: ${gameState.diceValue}`,
            textColor: outline,
            backColor: highlightColor
        });
    }

    // Draw instructions for no more moves
    if (gameState.turnState == 2) {
        drawButton({
            ...rollDiceBtn,
            width: 400,
            font: '12px Arial',
            centerY: height - 10,
            text: `No moves availabe. Click anywhere for next player's turn.`,
            textColor: outline,
            backColor: clear
        });
    } else if (gameState.turnState == 1) {
        drawButton({
            ...rollDiceBtn,
            width: 400,
            font: '12px Arial',
            centerY: height - 10,
            text: `Click on the piece to move based on the dice value.`,
            textColor: outline,
            backColor: clear
        });
    }

}, 33);