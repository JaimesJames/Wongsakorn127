import { checkWinner, getWinLength, isBoardFull, Cell } from './xogame-win-checker';

function emptyBoard(size: number): Cell[] {
  return new Array(size * size).fill(null);
}

describe('getWinLength', () => {
  it('matches the board size for sizes up to 5', () => {
    expect(getWinLength(3)).toBe(3);
    expect(getWinLength(4)).toBe(4);
    expect(getWinLength(5)).toBe(5);
  });
});

describe('checkWinner', () => {
  it('returns null when nobody has won', () => {
    const board = emptyBoard(3);
    board[0] = 'X';
    board[1] = 'O';
    expect(checkWinner(board, 3)).toBeNull();
  });

  it('detects a horizontal win on a 3x3 board', () => {
    const board = emptyBoard(3);
    board[3] = 'X';
    board[4] = 'X';
    board[5] = 'X';
    expect(checkWinner(board, 3)).toBe('X');
  });

  it('detects a vertical win on a 3x3 board', () => {
    const board = emptyBoard(3);
    board[0] = 'O';
    board[3] = 'O';
    board[6] = 'O';
    expect(checkWinner(board, 3)).toBe('O');
  });

  it('detects a diagonal win (top-left to bottom-right) on a 3x3 board', () => {
    const board = emptyBoard(3);
    board[0] = 'X';
    board[4] = 'X';
    board[8] = 'X';
    expect(checkWinner(board, 3)).toBe('X');
  });

  it('detects an anti-diagonal win (top-right to bottom-left) on a 3x3 board', () => {
    const board = emptyBoard(3);
    board[2] = 'O';
    board[4] = 'O';
    board[6] = 'O';
    expect(checkWinner(board, 3)).toBe('O');
  });

  it('requires 4 in a row on a 4x4 board; 3 in a row is not a win', () => {
    const board = emptyBoard(4);
    board[0] = 'X';
    board[1] = 'X';
    board[2] = 'X';
    expect(checkWinner(board, 4)).toBeNull();

    board[3] = 'X';
    expect(checkWinner(board, 4)).toBe('X');
  });

  it('requires 5 in a row on a 5x5 board', () => {
    const board = emptyBoard(5);
    for (let i = 0; i < 4; i++) {
      board[i] = 'O';
    }
    expect(checkWinner(board, 5)).toBeNull();

    board[4] = 'O';
    expect(checkWinner(board, 5)).toBe('O');
  });
});

describe('isBoardFull', () => {
  it('returns false when at least one cell is empty', () => {
    const board = emptyBoard(3);
    board[0] = 'X';
    expect(isBoardFull(board)).toBeFalse();
  });

  it('returns true when every cell is filled', () => {
    const board: Cell[] = new Array(9).fill('X');
    expect(isBoardFull(board)).toBeTrue();
  });
});
