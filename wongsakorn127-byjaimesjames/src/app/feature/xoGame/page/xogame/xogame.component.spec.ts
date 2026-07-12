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

  describe('skills disabled (default)', () => {
    it('grants no skill charges and selecting a skill has no effect', () => {
      component.selectBoardSize(3);
      component.startGame();

      expect(component.skillCharges['X'].block).toBe(0);
      expect(component.skillCharges['X'].remove).toBe(0);

      component.selectSkill('block');
      expect(component.selectedSkill).toBeNull();

      // Behaves exactly like the base game: playCell places a mark normally.
      component.playCell(0);
      expect(component.board[0]).toBe('X');
    });
  });

  describe('skills enabled', () => {
    beforeEach(() => {
      component.toggleSkills();
      component.selectBoardSize(3);
      component.startGame();
    });

    it('grants each player one charge of each skill', () => {
      expect(component.skillCharges['X']).toEqual({ block: 1, remove: 1 });
      expect(component.skillCharges['O']).toEqual({ block: 1, remove: 1 });
    });

    it('blocks a cell for exactly 2 turns (opponent + placer), then frees it', () => {
      // X blocks cell 4.
      component.selectSkill('block');
      component.playCell(4);
      expect(component.isBlocked(4)).toBeTrue();
      expect(component.skillCharges['X'].block).toBe(0);
      expect(component.currentPlayer).toBe('O');

      // O cannot place on the blocked cell.
      component.playCell(4);
      expect(component.board[4]).toBeNull();
      expect(component.currentPlayer).toBe('O');

      // O plays elsewhere (turn 1 of the block's duration).
      component.playCell(0);
      expect(component.isBlocked(4)).toBeTrue();
      expect(component.currentPlayer).toBe('X');

      // X cannot place on the still-blocked cell either.
      component.playCell(4);
      expect(component.board[4]).toBeNull();

      // X plays elsewhere (turn 2 of the block's duration) - now it clears.
      component.playCell(1);
      expect(component.isBlocked(4)).toBeFalse();
      expect(component.currentPlayer).toBe('O');

      // Now placeable again.
      component.playCell(4);
      expect(component.board[4]).toBe('O');
    });

    it('removes the target opponent mark and consumes the turn', () => {
      component.playCell(0); // X
      component.playCell(1); // O

      component.selectSkill('remove');
      component.playCell(1); // X removes O's mark at 1

      expect(component.board[1]).toBeNull();
      expect(component.skillCharges['X'].remove).toBe(0);
      expect(component.currentPlayer).toBe('O');
      expect(component.selectedSkill).toBeNull();
    });

    it('rejects removing an empty cell or the player\'s own mark', () => {
      component.playCell(0); // X
      component.playCell(1); // O - it's X's turn again

      component.selectSkill('remove');
      component.playCell(2); // empty - invalid target
      expect(component.skillCharges['X'].remove).toBe(1);
      expect(component.currentPlayer).toBe('X');

      component.playCell(0); // X's own mark - invalid target for X's remove
      expect(component.board[0]).toBe('X');
      expect(component.skillCharges['X'].remove).toBe(1);
    });

    it('cannot use a skill a second time once its charge is spent', () => {
      component.selectSkill('block');
      component.playCell(4); // X spends its block charge
      component.playCell(0); // O
      // X's turn again
      component.selectSkill('block');
      expect(component.selectedSkill).toBeNull();
    });

    it('cancelSkill clears the selection without consuming a turn or charge', () => {
      component.selectSkill('block');
      component.cancelSkill();

      expect(component.selectedSkill).toBeNull();
      expect(component.skillCharges['X'].block).toBe(1);
      expect(component.currentPlayer).toBe('X');
    });

    it('does not allow selecting a skill once the game has ended', () => {
      component.playCell(0); // X
      component.playCell(3); // O
      component.playCell(1); // X
      component.playCell(4); // O
      component.playCell(2); // X wins

      expect(component.winner).toBe('X');
      component.selectSkill('remove');
      expect(component.selectedSkill).toBeNull();
    });
  });
});
