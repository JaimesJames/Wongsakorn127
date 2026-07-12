import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellComponent } from '../../../../core/layout/shell/shell.component';
import { Cell, Mark, checkWinner, getWinLength, isBoardFull } from '../../services/xogame-win-checker';

type BoardSize = 3 | 4 | 5;
export type Skill = 'block' | 'remove';

interface SkillCharges {
  block: number;
  remove: number;
}

const BLOCK_DURATION_TURNS = 2;

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
  skillsEnabled = false;
  gameStarted = false;
  board: Cell[] = [];
  currentPlayer: Mark = 'X';
  winner: Mark | null = null;
  isDraw = false;

  blockedTurnsRemaining: (number | null)[] = [];
  selectedSkill: Skill | null = null;
  skillCharges: Record<Mark, SkillCharges> = {
    X: { block: 0, remove: 0 },
    O: { block: 0, remove: 0 },
  };

  get winLength(): number {
    return getWinLength(this.boardSize);
  }

  get opponent(): Mark {
    return this.currentPlayer === 'X' ? 'O' : 'X';
  }

  selectBoardSize(size: BoardSize): void {
    this.boardSize = size;
  }

  toggleSkills(): void {
    this.skillsEnabled = !this.skillsEnabled;
  }

  startGame(): void {
    const cellCount = this.boardSize * this.boardSize;
    this.board = new Array(cellCount).fill(null);
    this.blockedTurnsRemaining = new Array(cellCount).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.isDraw = false;
    this.selectedSkill = null;
    this.skillCharges = {
      X: { block: this.skillsEnabled ? 1 : 0, remove: this.skillsEnabled ? 1 : 0 },
      O: { block: this.skillsEnabled ? 1 : 0, remove: this.skillsEnabled ? 1 : 0 },
    };
    this.gameStarted = true;
  }

  isBlocked(index: number): boolean {
    return this.blockedTurnsRemaining[index] != null;
  }

  selectSkill(skill: Skill): void {
    if (this.winner || this.isDraw) {
      return;
    }
    if (this.skillCharges[this.currentPlayer][skill] <= 0) {
      return;
    }
    this.selectedSkill = skill;
  }

  cancelSkill(): void {
    this.selectedSkill = null;
  }

  isCellDisabled(index: number): boolean {
    if (this.winner || this.isDraw) {
      return true;
    }
    if (this.selectedSkill === 'block') {
      return !!this.board[index] || this.isBlocked(index);
    }
    if (this.selectedSkill === 'remove') {
      return this.board[index] !== this.opponent;
    }
    return !!this.board[index] || this.isBlocked(index);
  }

  playCell(index: number): void {
    if (this.winner || this.isDraw) {
      return;
    }

    if (this.selectedSkill) {
      this.applySkill(index);
      return;
    }

    if (this.board[index] || this.isBlocked(index)) {
      return;
    }

    this.board[index] = this.currentPlayer;
    this.endTurn(index);
  }

  private applySkill(index: number): void {
    const skill = this.selectedSkill;
    if (!skill) {
      return;
    }

    if (skill === 'block') {
      if (this.board[index] || this.isBlocked(index)) {
        return;
      }
      this.blockedTurnsRemaining[index] = BLOCK_DURATION_TURNS;
    } else {
      if (this.board[index] !== this.opponent) {
        return;
      }
      this.board[index] = null;
    }

    this.skillCharges[this.currentPlayer][skill]--;
    this.selectedSkill = null;
    this.endTurn(index);
  }

  private endTurn(actedIndex: number): void {
    this.tickBlocks(actedIndex);

    const winner = checkWinner(this.board, this.boardSize);
    if (winner) {
      this.winner = winner;
      return;
    }

    if (isBoardFull(this.board)) {
      this.isDraw = true;
      return;
    }

    this.currentPlayer = this.opponent;
  }

  private tickBlocks(skipIndex: number): void {
    for (let i = 0; i < this.blockedTurnsRemaining.length; i++) {
      if (i === skipIndex || this.blockedTurnsRemaining[i] == null) {
        continue;
      }
      const remaining = (this.blockedTurnsRemaining[i] as number) - 1;
      this.blockedTurnsRemaining[i] = remaining > 0 ? remaining : null;
    }
  }

  playAgain(): void {
    this.startGame();
  }

  changeBoardSize(): void {
    this.gameStarted = false;
  }
}
