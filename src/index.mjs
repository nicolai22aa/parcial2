const rows = 10;
const cols = 10;
const minesCount = 15;
let board = [];
let minePositions = new Set();

const gameBoard = document.getElementById("gameBoard");

// Generar tablero vacío
function createBoard() {
  board = Array(rows)
    .fill()
    .map(() => Array(cols).fill({ mine: false, revealed: false, flag: false }));

  placeMines();
  updateNumbers();

  gameBoard.innerHTML = "";
  board.forEach((row, r) => {
    row.forEach((cell, c) => {
      let div = document.createElement("div");
      div.classList.add("cell");
      div.dataset.row = r;
      div.dataset.col = c;
      div.addEventListener("click", revealCell);
      div.addEventListener("contextmenu", placeFlag);
      gameBoard.appendChild(div);
    });
  });
}

// Colocar minas aleatoriamente
function placeMines() {
  while (minePositions.size < minesCount) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);
    let pos = `${r},${c}`;
    if (!minePositions.has(pos)) {
      minePositions.add(pos);
      board[r][c] = { mine: true, revealed: false, flag: false };
    }
  }
}

// Calcular números de minas cercanas
function updateNumbers() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      getNeighbors(r, c).forEach(([nr, nc]) => {
        if (board[nr][nc].mine) count++;
      });
      board[r][c] = { mine: false, revealed: false, flag: false, count };
    }
  }
}

// Obtener vecinos de una celda
function getNeighbors(r, c) {
  return [
    [r - 1, c - 1],
    [r - 1, c],
    [r - 1, c + 1],
    [r, c - 1],
    [r, c + 1],
    [r + 1, c - 1],
    [r + 1, c],
    [r + 1, c + 1],
  ].filter(([nr, nc]) => nr >= 0 && nr < rows && nc >= 0 && nc < cols);
}

// Revelar celda
function revealCell(event) {
  let r = parseInt(event.target.dataset.row);
  let c = parseInt(event.target.dataset.col);
  if (board[r][c].revealed || board[r][c].flag) return;

  board[r][c].revealed = true;
  let cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
  cell.classList.add("revealed");

  if (board[r][c].mine) {
    cell.classList.add("mine");
    alert("¡Perdiste! Intenta de nuevo.");
    setTimeout(createBoard, 1000);
    return;
  }

  if (board[r][c].count > 0) {
    cell.textContent = board[r][c].count;
  } else {
    getNeighbors(r, c).forEach(([nr, nc]) => {
      if (!board[nr][nc].revealed)
        revealCell({
          target: document.querySelector(
            `[data-row="${nr}"][data-col="${nc}"]`
          ),
        });
    });
  }

  checkWin();
}

// Colocar bandera
function placeFlag(event) {
  event.preventDefault();
  let r = parseInt(event.target.dataset.row);
  let c = parseInt(event.target.dataset.col);
  if (board[r][c].revealed) return;

  board[r][c].flag = !board[r][c].flag;
  event.target.classList.toggle("flag");
  event.target.textContent = board[r][c].flag ? "🚩" : "";
}

// Comprobar si el jugador gana
function checkWin() {
  let revealedCount = board.flat().filter((cell) => cell.revealed).length;
  let totalSafeCells = rows * cols - minesCount;
  if (revealedCount === totalSafeCells) {
    alert("¡Ganaste!");
    setTimeout(createBoard, 1000);
  }
}

// Iniciar juego
createBoard();
