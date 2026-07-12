import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XogameComponent } from './xogame.component';
import { Cell } from '../../services/xogame-win-checker';

describe('XogameComponent', () => {
  let component: XogameComponent;
  let fixture: ComponentFixture<XogameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XogameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(XogameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts on the board-size selection screen', () => {
    expect(component.gameStarted).toBeFalse();
  });

  it('starts a game with an empty board of the chosen size', () => {
    component.selectBoardSize(4);
    component.startGame();

    expect(component.gameStarted).toBeTrue();
    expect(component.board.length).toBe(16);
    expect(component.board.every((cell) => cell === null)).toBeTrue();
    expect(component.currentPlayer).toBe('X');
  });

  it('alternates turns after each move', () => {
    component.selectBoardSize(3);
    component.startGame();

    component.playCell(0);
    expect(component.board[0]).toBe('X');
    expect(component.currentPlayer).toBe('O');

    component.playCell(1);
    expect(component.board[1]).toBe('O');
    expect(component.currentPlayer).toBe('X');
  });

  it('ignores a move on an already-occupied cell', () => {
    component.selectBoardSize(3);
    component.startGame();

    component.playCell(0);
    component.playCell(0);

    expect(component.board[0]).toBe('X');
    expect(component.currentPlayer).toBe('O');
  });

  it('declares a winner and stops accepting moves', () => {
    component.selectBoardSize(3);
    component.startGame();

    // X: 0,1,2 (top row) with O playing elsewhere in between
    component.playCell(0); // X
    component.playCell(3); // O
    component.playCell(1); // X
    component.playCell(4); // O
    component.playCell(2); // X wins

    expect(component.winner).toBe('X');

    component.playCell(5);
    expect(component.board[5]).toBeNull();
  });

  it('declares a draw when the board fills with no winner', () => {
    component.selectBoardSize(3);
    component.startGame();
    // Final board, filled with no 3-in-a-row for either mark:
    // X O X
    // X O O
    // O X X
    const expectedBoard: Cell[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
    moves.forEach((idx) => component.playCell(idx));

    expect(component.board).toEqual(expectedBoard);
    expect(component.isDraw).toBeTrue();
    expect(component.winner).toBeNull();
  });

  it('playAgain resets the board but keeps the chosen size', () => {
    component.selectBoardSize(4);
    component.startGame();
    component.playCell(0);

    component.playAgain();

    expect(component.board.length).toBe(16);
    expect(component.board.every((cell) => cell === null)).toBeTrue();
    expect(component.winner).toBeNull();
    expect(component.isDraw).toBeFalse();
  });

  it('changeBoardSize returns to the size-selection screen', () => {
    component.selectBoardSize(3);
    component.startGame();

    component.changeBoardSize();

    expect(component.gameStarted).toBeFalse();
  });
});
