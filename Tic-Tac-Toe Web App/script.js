const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const aiToggle = document.getElementById('aiToggle');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[clickedIndex] !== '' || !gameActive) return;

  makeMove(clickedIndex, currentPlayer);

  if (checkResult()) return;

  // If AI mode and currentPlayer is O (AI), make AI move
  if (aiToggle.checked && currentPlayer === 'O' && gameActive) {
    setTimeout(() => {
      const aiMove = getRandomEmptyCell();
      if (aiMove !== null) {
        makeMove(aiMove, 'O');
        checkResult();
      }
    }, 500); // slight delay for realism
  }
}

function makeMove(index, player) {
  gameState[index] = player;
  cells[index].textContent = player;
  currentPlayer = player === 'X' ? 'O' : 'X';
  if (gameActive) {
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function getRandomEmptyCell() {
  const emptyIndices = gameState.map((val, idx) => val === '' ? idx : null).filter(idx => idx !== null);
  if (emptyIndices.length === 0) return null;
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function checkResult() {
  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      statusText.textContent = `🎉 Player ${gameState[a]} Wins!`;
      gameActive = false;
      return true;
    }
  }

  if (!gameState.includes('')) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return true;
  }

  return false;
}

function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = 'X';
  cells.forEach(cell => cell.textContent = '');
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
