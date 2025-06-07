const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const size = canvas.width;
const cellSize = size / 3;
const message = document.getElementById('message');

const gridState = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

let currentPlayer = 1; // 1: 〇, 2: ×
let gameOver = false;

function drawGrid() {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(cellSize * i, 0);
        ctx.lineTo(cellSize * i, size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, cellSize * i);
        ctx.lineTo(size, cellSize * i);
        ctx.stroke();
    }
}

function drawCircle(row, col) {
    const centerX = col * cellSize + cellSize / 2;
    const centerY = row * cellSize + cellSize / 2;
    const radius = cellSize / 3;

    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
}

function drawCross(row, col) {
    const padding = cellSize / 4;
    const x1 = col * cellSize + padding;
    const y1 = row * cellSize + padding;
    const x2 = (col + 1) * cellSize - padding;
    const y2 = (row + 1) * cellSize - padding;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y1);
    ctx.lineTo(x1, y2);
    ctx.stroke();
}

function checkWinner() {
    // 横・縦
    for (let i = 0; i < 3; i++) {
        if (gridState[i][0] && gridState[i][0] === gridState[i][1] && gridState[i][1] === gridState[i][2]) {
            return gridState[i][0];
        }
        if (gridState[0][i] && gridState[0][i] === gridState[1][i] && gridState[1][i] === gridState[2][i]) {
            return gridState[0][i];
        }
    }
    // 斜め
    if (gridState[0][0] && gridState[0][0] === gridState[1][1] && gridState[1][1] === gridState[2][2]) {
        return gridState[0][0];
    }
    if (gridState[0][2] && gridState[0][2] === gridState[1][1] && gridState[1][1] === gridState[2][0]) {
        return gridState[0][2];
    }

    // 引き分け判定（全マス埋まってて勝者なし）
    const allFilled = gridState.flat().every(cell => cell !== 0);
    if (allFilled) return 'draw';

    return null;
}

canvas.addEventListener('click', function (event) {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (gridState[row][col] !== 0) return;

    if (currentPlayer === 1) {
        drawCircle(row, col);
        gridState[row][col] = 1;
        currentPlayer = 2;
        message.textContent = "プレイヤー×の番です";
    } else {
        drawCross(row, col);
        gridState[row][col] = 2;
        currentPlayer = 1;
        message.textContent = "プレイヤー〇の番です";
    }

    const winner = checkWinner();
    if (winner) {
        gameOver = true;
        if (winner === 'draw') {
            message.textContent = "引き分けです！";
        } else {
            message.textContent = `プレイヤー${winner === 1 ? "〇" : "×"}の勝ちです！`;
        }
    }
});

drawGrid();
