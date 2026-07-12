import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellComponent } from '../../../../core/layout/shell/shell.component';
import { Cell, Mark, checkWinner, getWinLength, isBoardFull } from '../../services/xogame-win-checker';

type BoardSize = 3 | 4 | 5;

@Component({
  selector: 'app-xogame',
  standalone: true,
  imports: [CommonModule, ShellComponent],
  templateUrl: './xogame.component.html',
  styleUrl: './xogame.component.css',
})
export class XogameComponent {
  readonly boardSizeOptions: BoardSize[] = [3, 4, 5];

  boardSize: BoardSize = 3;
  gameStarted = false;
  board: Cell[] = [];
  currentPlayer: Mark = 'X';
  winner: Mark | null = null;
  isDraw = false;

  get winLength(): number {
    return getWinLength(this.boardSize);
  }

  selectBoardSize(size: BoardSize): void {
    this.boardSize = size;
  }

  startGame(): void {
    this.board = new Array(this.boardSize * this.boardSize).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.isDraw = false;
    this.gameStarted = true;
  }

  playCell(index: number): void {
    if (this.winner || this.isDraw || this.board[index]) {
      return;
    }

    this.board[index] = this.currentPlayer;

    const winner = checkWinner(this.board, this.boardSize);
    if (winner) {
      this.winner = winner;
      return;
    }

    if (isBoardFull(this.board)) {
      this.isDraw = true;
      return;
    }

    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  playAgain(): void {
    this.startGame();
  }

  changeBoardSize(): void {
    this.gameStarted = false;
  }
}
