const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

const rows = 31;
const cols = 31;
const cellSize = 15;
const centerRow = Math.floor(rows / 2);
const centerCol = Math.floor(cols / 2);

let highlightRange = { min: 1, max: 1 };
let lowhighLimit = { min: 1, max: 1 };
let lowhighRangeLimit = { min: 1, max: 1 };
let range = 0;
let useSquareRange = false;
let useSquareRRange = false;
let useRectRange = false;
let useLineRange = false;
let useLineRRange = false;

function manhattanDistance(r1, c1, r2, c2) {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

function isInHighlightRange(i, j) {
    const dist = manhattanDistance(i, j, centerRow, centerCol);
    return dist >= highlightRange.min && dist <= highlightRange.max;
}

function isInRangeFromOrigin(i, j, originRow, originCol, rangeMin, rangeMax) {
    const dist = manhattanDistance(i, j, originRow, originCol);
    return dist >= rangeMin && dist <= rangeMax;
}

function isInSquareRange(i, j, originRow, originCol, size) {
    return (
        i >= originRow - size &&
        i <= originRow + size &&
        j >= originCol - size &&
        j <= originCol + size
    );
}

function isInCustomRectRange(i, j, originRow, originCol, width, height) {
    const halfW = Math.floor(width / 2);

    const bottomRow = originRow;  // 下辺が起点
    const topRow = originRow - height + 1;  // 上に伸びる

    const leftCol = originCol - halfW;
    const rightCol = originCol + (width - 1) - halfW;

    return (
        i >= topRow && i <= bottomRow &&
        j >= leftCol && j <= rightCol
    );
}

function isInLineRange(i, j, originRow, originCol, minSize, size, selecter) {
    const rowDiff = Math.abs(i - originRow);
    const colDiff = Math.abs(j - originCol);
    if (selecter) {
        if (i >= originRow) return false;
    }
    return (
        (i === originRow && colDiff >= minSize && colDiff <= size) ||
        (j === originCol && rowDiff >= minSize && rowDiff <= size)
    );
}

function findFarthestCell() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (manhattanDistance(i, j, centerRow, centerCol) === highlightRange.max) {
                return { r: i, c: j };
            }
        }
    }
    return null;
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.transform(1, 0, -0.275, 0.65, 0, 0);
    ctx.rotate(Math.PI / 7);

    ctx.strokeStyle = 'rgba(200, 200, 200, 0.1)';
    ctx.lineWidth = 2;
    ctx.setLineDash([1, 3]);

    const farthest = findFarthestCell();

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const x = (j - centerCol) * cellSize;
            const y = (i - centerRow) * cellSize;

            if (i === centerRow && j === centerCol) {
                ctx.fillStyle = '#ff9900';
                ctx.fillRect(x, y, cellSize, cellSize);
            } else if (useLineRange) {
                if (isInLineRange(i, j, centerCol, centerRow, highlightRange.min, highlightRange.max, false)) {
                    ctx.fillStyle = '#ff7f50';
                    ctx.fillRect(x, y, cellSize, cellSize);
                }
            } else if (useSquareRange) {
                if (isInSquareRange(i, j, centerCol, centerRow, highlightRange.max)) {
                    ctx.fillStyle = '#ff7f50';
                    ctx.fillRect(x, y, cellSize, cellSize);
                }
            } else if (isInHighlightRange(i, j)) {
                ctx.fillStyle = '#ff7f50';
                ctx.fillRect(x, y, cellSize, cellSize);
            }

            // 🔽 range 塗り処理
            if (range >= 0 && farthest) {
                // 🔀 フラグによる分岐処理
                if (useSquareRRange) {
                    // ✅ 四角範囲で塗りつぶす
                    if (isInSquareRange(i, j, farthest.r, farthest.c, range)) {
                        ctx.fillStyle = '#ffd45c';
                        ctx.fillRect(x, y, cellSize, cellSize);
                    }
                } else if (useRectRange) {
                    // ✅ 長方形範囲で塗りつぶす
                    if (isInCustomRectRange(i, j, farthest.r, farthest.c, Math.floor(range / 10), range % 10)) {
                        ctx.fillStyle = '#ffd45c';
                        ctx.fillRect(x, y, cellSize, cellSize);
                    }
                } else if (useLineRRange) {
                    // ✅ 直線範囲で塗りつぶす
                    if (isInLineRange(i, j, centerCol, centerRow, Math.floor(range / 10), range % 10, true)) {
                        ctx.fillStyle = '#ffd45c';
                        ctx.fillRect(x, y, cellSize, cellSize);
                    }
                } else {
                    // ✅ 従来通りマンハッタン距離で塗る
                    if (isInRangeFromOrigin(i, j, farthest.r, farthest.c, 1, range)) {
                        ctx.fillStyle = '#ffd45c';
                        ctx.fillRect(x, y, cellSize, cellSize);
                    }
                }
                // 最遠マスを描画
                if (i === farthest.r && j === farthest.c && useRectRange === false && useLineRRange === false) {
                    if (range === 0) {
                        ctx.fillStyle = '#ffd45c';
                    } else {
                        ctx.fillStyle = '#ff9900';
                    }
                    ctx.fillRect(x, y, cellSize, cellSize);
                }

            }

            ctx.strokeRect(x, y, cellSize, cellSize);
        }
    }

    ctx.restore();
}

function setGridRangeValue(index) {
    highlightRange = {
        min: Number(filtered[index][7]),
        max: Number(filtered[index][8])
    };
    range = Number(filtered[index][9]);
    useSquareRange = (filtered[index][10] === "1");
    useSquareRRange = (filtered[index][11] === "1");
    useRectRange = (filtered[index][12] === "1");
    useLineRange = (filtered[index][13] === "1");
    useLineRRange = (filtered[index][14] === "1");
    lowhighLimit = {
        min: Number(filtered[index][15]),
        max: Number(filtered[index][16])
    };
    lowhighRangeLimit = {
        min: Number(filtered[index][17]),
        max: Number(filtered[index][18])
    };
    /*
    console.log(filtered);
    console.log("index: " + index);
    console.log(highlightRange);
    console.log("range: " + range);
    console.log("useSquareRange: " + useSquareRange);
    console.log("useSquareRRange: " + useSquareRRange);
    console.log("useRectRange: " + useRectRange);
    console.log("useLineRange: " + useLineRange);
    console.log("useLineRRange: " + useLineRRange);
    */

    drawGrid();
}