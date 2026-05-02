const BOARD_SIZE = 8;
let board = [];
let selectedPiece = null;
let currentTurn = 'red';
let validMoves = [];
let redPieces = 12;
let blackPieces = 12;
let mustContinueJump = false;
let moveCount = 0;
let moveHistory = [];
let stateStack = [];
let lastMove = null;
let capturedRed = [];
let capturedBlack = [];
let promotedPositions = [];

function saveState() {
  stateStack.push({
    board: board.map(row => row.map(cell => cell ? { ...cell } : null)),
    selectedPiece: selectedPiece ? { ...selectedPiece } : null,
    currentTurn,
    validMoves: validMoves.map(m => ({ ...m })),
    redPieces,
    blackPieces,
    mustContinueJump,
    moveCount,
    lastMove: lastMove ? { ...lastMove } : null,
    capturedRed: [...capturedRed],
    capturedBlack: [...capturedBlack],
    promotedPositions: [...promotedPositions],
    moveHistory: [...moveHistory]
  });
}

function restoreState(state) {
  board = state.board;
  selectedPiece = state.selectedPiece;
  currentTurn = state.currentTurn;
  validMoves = state.validMoves;
  redPieces = state.redPieces;
  blackPieces = state.blackPieces;
  mustContinueJump = state.mustContinueJump;
  moveCount = state.moveCount;
  lastMove = state.lastMove;
  capturedRed = state.capturedRed;
  capturedBlack = state.capturedBlack;
  promotedPositions = state.promotedPositions;
  moveHistory = state.moveHistory;
  renderBoard();
  updateUndoButton();
}

function undoMove() {
  if (stateStack.length === 0) return;
  const prev = stateStack.pop();
  restoreState(prev);
}

function updateUndoButton() {
  const btn = document.getElementById('undo-btn');
  if (btn) btn.disabled = stateStack.length === 0;
}

function initBoard() {
  board = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row][col] = null;
      if ((row + col) % 2 === 1) {
        if (row < 3) {
          board[row][col] = { color: 'black', king: false };
        } else if (row > 4) {
          board[row][col] = { color: 'red', king: false };
        }
      }
    }
  }
}

function getCaptureLabel(move) {
  if (!move.jump) return '';
  return `(${String.fromCharCode(97 + move.jump.col)}${8 - move.jump.row})`;
}

function recordMove(fromRow, fromCol, toRow, toCol, move) {
  moveCount++;
  const fromLabel = `${String.fromCharCode(97 + fromCol)}${8 - fromRow}`;
  const toLabel = `${String.fromCharCode(97 + toCol)}${8 - toRow}`;
  const isCapture = move.jump !== null;
  const wasPromoted = promotedPositions.some(p => p.row === toRow);

  let moveText = `${fromLabel}→${toLabel}`;
  if (isCapture) moveText += ` ×${getCaptureLabel(move)}`;
  if (wasPromoted) moveText += ' 👑';

  moveHistory.push({
    number: moveCount,
    color: currentTurn === 'red' ? 'black' : 'red',
    text: moveText,
    isCapture,
    isKing: wasPromoted
  });
}

function addCapturedPiece(piece) {
  if (piece.color === 'red') capturedRed.push({ king: piece.king });
  else capturedBlack.push({ king: piece.king });
}

function renderBoard() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';

  const jumpsRequired = !mustContinueJump ? getJumpsForColor(currentTurn, board) : [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (lastMove &&
          ((lastMove.toRow === row && lastMove.toCol === col) ||
           (lastMove.fromRow === row && lastMove.fromCol === col))) {
        cell.classList.add('last-move');
      }

      const isValidMove = validMoves.some(m => m.row === row && m.col === col);
      if (isValidMove) {
        const isJump = validMoves.find(m => m.row === row && m.col === col)?.jump !== null;
        cell.classList.add(isJump ? 'valid-jump' : 'valid-move');
        cell.addEventListener('click', () => movePiece(row, col));
      }

      if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
        cell.classList.add('selected');
      }

      const piece = board[row][col];
      if (piece) {
        const pieceEl = document.createElement('div');
        pieceEl.classList.add('piece', piece.color);
        if (piece.king) pieceEl.classList.add('king');
        if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
          pieceEl.classList.add('selected');
        }

        if (jumpsRequired.some(j => j.row === row && j.col === col)) {
          pieceEl.classList.add('can-capture');
        }

        if (piece.color === currentTurn) {
          const canSelect = !mustContinueJump ||
            (mustContinueJump && selectedPiece && selectedPiece.row === row && selectedPiece.col === col);
          if (canSelect) {
            pieceEl.addEventListener('click', (e) => {
              e.stopPropagation();
              selectPiece(row, col);
            });
          }
        }

        cell.appendChild(pieceEl);
      }

      boardEl.appendChild(cell);
    }
  }

  updateUI();
  updateUndoButton();
  renderCaptured();
  renderHistory();
}

function selectPiece(row, col) {
  const piece = board[row][col];
  if (!piece || piece.color !== currentTurn) return;

  if (mustContinueJump) {
    if (selectedPiece && (selectedPiece.row !== row || selectedPiece.col !== col)) return;
  }

  selectedPiece = { row, col };
  validMoves = getValidMoves(row, col, board, piece);

  if (validMoves.length === 0) {
    selectedPiece = null;
  }

  renderBoard();
}

function isValidPosition(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function getValidMoves(row, col, currentBoard, piece, skipCheck) {
  const moves = [];
  const directions = [];

  if (piece.king) {
    directions.push(-1, 1);
  } else {
    directions.push(piece.color === 'red' ? -1 : 1);
  }

  for (const dRow of directions) {
    for (const dCol of [-1, 1]) {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (isValidPosition(newRow, newCol) && !currentBoard[newRow][newCol]) {
        if (!mustContinueJump) {
          moves.push({ row: newRow, col: newCol, jump: null });
        }
      }

      const jumpRow = row + dRow * 2;
      const jumpCol = col + dCol * 2;
      if (isValidPosition(jumpRow, jumpCol) && !currentBoard[jumpRow][jumpCol]) {
        const midPiece = currentBoard[newRow]?.[newCol];
        if (midPiece && midPiece.color !== piece.color) {
          moves.push({ row: jumpRow, col: jumpCol, jump: { row: newRow, col: newCol } });
        }
      }
    }
  }

  if (mustContinueJump) {
    return moves.filter(m => m.jump !== null);
  }

  if (skipCheck) return moves;

  const jumps = moves.filter(m => m.jump !== null);
  if (jumps.length > 0) {
    const allJumps = getJumpsForColor(currentTurn, currentBoard);
    if (allJumps.length > 0) {
      return jumps;
    }
  }

  return moves;
}

function getJumpsForColor(color, currentBoard) {
  const jumps = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = currentBoard[r][c];
      if (piece && piece.color === color) {
        const pieceMoves = getValidMoves(r, c, currentBoard, piece, true);
        if (pieceMoves.some(m => m.jump)) {
          jumps.push({ row: r, col: c });
        }
      }
    }
  }
  return jumps;
}

function movePiece(row, col) {
  const move = validMoves.find(m => m.row === row && m.col === col);
  if (!move) return;

  const fromRow = selectedPiece.row;
  const fromCol = selectedPiece.col;
  const piece = board[fromRow][fromCol];

  saveState();

  board[row][col] = piece;
  board[fromRow][fromCol] = null;

  if (move.jump) {
    const capturedPiece = board[move.jump.row][move.jump.col];
    board[move.jump.row][move.jump.col] = null;
    addCapturedPiece(capturedPiece);
    if (piece.color === 'red') blackPieces--;
    else redPieces--;

    promoteKing(piece, row);
    recordMove(fromRow, fromCol, row, col, move);

    const moreJumps = getValidMoves(row, col, board, piece).filter(m => m.jump !== null);
    if (moreJumps.length > 0) {
      selectedPiece = { row, col };
      validMoves = moreJumps;
      mustContinueJump = true;
      lastMove = { fromRow, fromCol, toRow: row, toCol: col };
      renderBoard();
      return;
    }
  } else {
    promoteKing(piece, row);
    recordMove(fromRow, fromCol, row, col, move);
  }

  lastMove = { fromRow, fromCol, toRow: row, toCol: col };
  endTurn();
}

function promoteKing(piece, row) {
  if (!piece.king) {
    if (piece.color === 'red' && row === 0) {
      piece.king = true;
      promotedPositions.push({ row });
      return true;
    }
    if (piece.color === 'black' && row === BOARD_SIZE - 1) {
      piece.king = true;
      promotedPositions.push({ row });
      return true;
    }
  }
  return false;
}

function endTurn() {
  selectedPiece = null;
  validMoves = [];
  mustContinueJump = false;
  currentTurn = currentTurn === 'red' ? 'black' : 'red';

  checkGameOver();
  renderBoard();
}

function checkGameOver() {
  if (redPieces === 0) {
    showGameOver('Pretas', 'black');
  } else if (blackPieces === 0) {
    showGameOver('Vermelhas', 'red');
  } else if (!hasAnyMoves(currentTurn)) {
    const winner = currentTurn === 'red' ? 'Pretas' : 'Vermelhas';
    showGameOver(winner, currentTurn === 'red' ? 'black' : 'red');
  }
}

function showGameOver(winnerName, winnerColor) {
  setTimeout(() => {
    const modal = document.getElementById('game-over-modal');
    document.getElementById('modal-icon').textContent = '🏆';
    document.getElementById('modal-title').textContent = `${winnerName} venceram!`;
    document.getElementById('modal-subtitle').textContent =
      winnerColor === 'red' ? 'Vermelhas dominaram o tabuleiro' : 'Pretas dominaram o tabuleiro';
    document.getElementById('modal-moves').textContent = `Total de jogadas: ${moveCount}`;
    modal.classList.remove('hidden');
  }, 300);
}

function hideGameOver() {
  document.getElementById('game-over-modal').classList.add('hidden');
}

function hasAnyMoves(color) {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        if (getValidMoves(r, c, board, piece).length > 0) {
          return true;
        }
      }
    }
  }
  return false;
}

function updateUI() {
  const turnEl = document.getElementById('turn-indicator');
  turnEl.textContent = `Vez das ${currentTurn === 'red' ? 'Vermelhas' : 'Pretas'}`;
  turnEl.className = 'turn-indicator' + (currentTurn === 'black' ? ' black-turn' : '');

  document.getElementById('red-score').textContent = `Vermelhas: ${redPieces}`;
  document.getElementById('black-score').textContent = `Pretas: ${blackPieces}`;

  const moveEl = document.getElementById('move-counter');
  if (moveEl) moveEl.textContent = `Jogada: ${moveCount}`;
}

function renderCaptured() {
  const redEl = document.getElementById('captured-red');
  const blackEl = document.getElementById('captured-black');

  redEl.innerHTML = '';
  blackEl.innerHTML = '';

  for (const p of capturedRed) {
    const el = document.createElement('div');
    el.className = `captured-piece red${p.king ? ' king' : ''}`;
    redEl.appendChild(el);
  }

  for (const p of capturedBlack) {
    const el = document.createElement('div');
    el.className = `captured-piece black${p.king ? ' king' : ''}`;
    blackEl.appendChild(el);
  }
}

function renderHistory() {
  const el = document.getElementById('move-history');

  if (moveHistory.length === 0) {
    el.innerHTML = '<p class="empty-history">Nenhuma jogada ainda...</p>';
    return;
  }

  el.innerHTML = '';
  for (const m of moveHistory) {
    const entry = document.createElement('div');
    entry.className = 'move-entry';

    const num = document.createElement('span');
    num.className = 'move-number';
    num.textContent = `${m.number}.`;

    const dot = document.createElement('span');
    dot.className = `move-dot ${m.color}`;

    const text = document.createElement('span');
    text.className = 'move-text';
    text.textContent = m.text;
    if (m.isCapture) text.classList.add('move-capture');
    if (m.isKing) text.classList.add('move-king');

    entry.appendChild(num);
    entry.appendChild(dot);
    entry.appendChild(text);
    el.appendChild(entry);
  }

  el.scrollTop = el.scrollHeight;
}

function resetGame() {
  hideGameOver();
  initBoard();
  selectedPiece = null;
  currentTurn = 'red';
  validMoves = [];
  redPieces = 12;
  blackPieces = 12;
  mustContinueJump = false;
  moveCount = 0;
  moveHistory = [];
  stateStack = [];
  lastMove = null;
  capturedRed = [];
  capturedBlack = [];
  promotedPositions = [];
  renderBoard();
}

document.getElementById('reset-btn').addEventListener('click', resetGame);
document.getElementById('undo-btn').addEventListener('click', undoMove);
document.getElementById('modal-play-again').addEventListener('click', resetGame);

document.addEventListener('keydown', (e) => {
  if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    undoMove();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    selectedPiece = null;
    validMoves = [];
    renderBoard();
  }
});

resetGame();
