export const generateMaze = (rows: number, cols: number, seed: number = 1): number[][] => {
    let random = (function () {
        let s = seed || Math.random();
        return function () {
            s = (s * 9301 + 49297) % 233280;
            return s / 233280;
        };
    })();
    const maze: number[][] = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(1));

    function isValid(row: number, col: number): boolean {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }

    function carvePath(row: number, col: number): void {
        maze[row][col] = 0;

        const directions = [
            [0, 2],
            [2, 0],
            [0, -2],
            [-2, 0],
        ];

        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }

        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;

            if (isValid(newRow, newCol) && maze[newRow][newCol] === 1) {
                // Прорубаем путь к соседней ячейке
                maze[row + dr / 2][col + dc / 2] = 0;
                carvePath(newRow, newCol);
            }
        }
    }

    let startRow = Math.floor((random() * (rows - 1)) / 2) * 2 + 1;
    let startCol = Math.floor((random() * (cols - 1)) / 2) * 2 + 1;

    carvePath(startRow, startCol);

    maze[0][1] = 0;

    const upDownWallnew = Array(rows).fill(1);
    maze.push(upDownWallnew);
    maze.unshift(upDownWallnew);

    maze[rows + 1][cols - 2] = 0;
    maze.forEach((_, index) => {
        maze[index][maze.length - 2] = 1;
    });

    return maze;
};
