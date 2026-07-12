export type Mark = 'X' | 'O';
export type Cell = Mark | null;

export function getWinLength(boardSize: number): number {
  return Math.min(boardSize, 5);
}

export function checkWinner(board: Cell[], boardSize: number): Mark | null {
  const winLength = getWinLength(boardSize);
  const directions = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: 1 },
    { dx: 1, dy: -1 },
  ];

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const mark = board[y * boardSize + x];
      if (!mark) continue;

      for (const { dx, dy } of directions) {
        let count = 1;
        for (let step = 1; step < winLength; step++) {
          const nx = x + dx * step;
          const ny = y + dy * step;
          if (nx < 0 || nx >= boardSize || ny < 0 || ny >= boardSize) break;
          if (board[ny * boardSize + nx] !== mark) break;
          count++;
        }
        if (count >= winLength) {
          return mark;
        }
      }
    }
  }

  return null;
}

export function isBoardFull(board: Cell[]): boolean {
  return board.every((cell) => cell !== null);
}
