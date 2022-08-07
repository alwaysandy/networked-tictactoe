function createBoard() {
    const gameCont = document.querySelector('.game-container');
    for (let y = 0; y < 3; y++) {
        const line = document.createElement('div');
        line.classList.add('line');
        board.push([]);
        for (let x = 0; x < 3; x++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.x = x;
            tile.dataset.y = y;
            if (x == 0) {
                tile.classList.add('r');
            } else if (x == 1) {
                tile.classList.add('l', 'r');
            } else {
                tile.classList.add('l');
            }

            if (y == 0) {
                tile.classList.add('b');
            } else if (y == 1) {
                tile.classList.add('t', 'b');
            } else if (y == 2) {
                tile.classList.add('t');
            }
            board[y][x] = tile;
            line.appendChild(tile);
        }


        gameCont.appendChild(line);
    }
}

function checkForWin() {
    let checks = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 3; i++) {
        if (pieces[i][0] == turn) {
            checks[0] += 1;
        }

        if (pieces[0][i] == turn) {
            checks[1] += 1;
        }

        if (pieces[i][i] == turn) {
            checks[2] += 1;
        }

        if (pieces[1][i] == turn) {
            checks[3] += 1;
        }

        if (pieces[i][1] == turn) {
            checks[4] += 1;
        }

        if (pieces[2][i] == turn) {
            checks[5] += 1;
        }

        if (pieces[i][2] == turn) {
            checks[6] += 1;
        }

        if (pieces[2 - i][i] == turn) {
            checks[7] += 1;
        }
    }

    for (let x of checks) {
        if (x == 3) {
            return true;
        }
    }

    return false;
}


function makeMove(x, y) {
    if (!pieces[y][x]) {
        if (turn == "X") {
            pieces[y][x] = "X";
        } else {
            pieces[y][x] = "O";
        }

        if (turn === pChar) {
            socket.emit('move', {'x': x, 'y': y});
        }

        board[y][x].textContent = turn;
        
        moves += 1;
    
        if (checkForWin()) {
            alert(`${turn.toUpperCase()} wins!`);
            turn = "ASS";
        } else if (moves == 9) {
            alert("TIE GAME!");
        } else {
            turn = turn == "X" ? "O" : "X";
        }
    }
}

function handleClick(t) {
    console.log(t.target.dataset);
    let x = parseInt(t.target.dataset.x);
    let y = parseInt(t.target.dataset.y);
    if (pChar && turn && pChar === turn) {
        makeMove(x, y);
    }
}

function addEventListeners() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile) => {
        tile.addEventListener('click', handleClick);
    });
}

function reset_game() {
    for (y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            board[y][x].textContent = "";
            pieces[y][x] = 0;
        }
    }
}

let reset_button = document.querySelector('#reset-game');
reset_button.addEventListener('click', () => {
    socket.emit('reset_server');
});

let close_button = document.querySelector('#close-game');
close_button.addEventListener('click', () => {
    window.location = '/';
    socket.emit('close_game');
});

let pID;
let pChar;
let turn;

let socket = io();
socket.emit('join', "");

socket.on('player', (id) => {
    pID = JSON.parse(id);
    console.log(pID);
});

socket.on('joined', (id) => {
    if (JSON.parse(id) === pID) {
        turn = "X";
        pChar = "X";
    } else {
        turn = "X";
        pChar = "O";
    }
});

socket.on('move', (c) => {
    console.log("Received");
    makeMove(c.x, c.y);
    turn = pChar;
});

socket.on('reset_game', (id) => {
    reset_game();
    if (pID === JSON.parse(id)) {
        turn = "X";
        pChar = "X";
    } else {
        turn = "X";
        pChar = "O";
    }

    moves = 0;
});

socket.on('close', () => {
    alert("Game closed by other player.");
    window.location = '/';
});

const board = [];
createBoard();
const pieces = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
let moves = 0;
addEventListeners();
