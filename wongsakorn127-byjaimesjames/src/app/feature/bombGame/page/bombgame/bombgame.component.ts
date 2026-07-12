import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellComponent } from '../../../../core/layout/shell/shell.component';

type Phase = 'setup' | 'handoff' | 'placement' | 'eating' | 'ended';
type Player = 1 | 2;
type Reveal = 'safe' | 'bomb' | null;

const PILE_SIZE = 10;

@Component({
  selector: 'app-bombgame',
  standalone: true,
  imports: [CommonModule, ShellComponent],
  templateUrl: './bombgame.component.html',
  styleUrl: './bombgame.component.css',
})
export class BombgameComponent {
  readonly pileSize = PILE_SIZE;
  readonly bombOptions: (1 | 2)[] = [1, 2];

  bombsPerPlayer: 1 | 2 = 1;
  phase: Phase = 'setup';

  bombs: boolean[] = [];
  revealed: Reveal[] = [];

  placingPlayer: Player = 1;
  placementSelections: number[] = [];

  currentEater: Player = 1;
  loser: Player | null = null;

  selectBombsPerPlayer(count: 1 | 2): void {
    this.bombsPerPlayer = count;
  }

  startSetup(): void {
    this.bombs = new Array(PILE_SIZE).fill(false);
    this.revealed = new Array(PILE_SIZE).fill(null);
    this.placingPlayer = 1;
    this.placementSelections = [];
    this.loser = null;
    this.phase = 'handoff';
  }

  confirmHandoff(): void {
    this.placementSelections = [];
    this.phase = 'placement';
  }

  togglePlacementCell(index: number): void {
    const selectedPos = this.placementSelections.indexOf(index);
    if (selectedPos !== -1) {
      this.placementSelections.splice(selectedPos, 1);
      return;
    }
    if (this.placementSelections.length >= this.bombsPerPlayer) {
      return;
    }
    this.placementSelections.push(index);
  }

  isSelectedForPlacement(index: number): boolean {
    return this.placementSelections.includes(index);
  }

  canConfirmPlacement(): boolean {
    return this.placementSelections.length === this.bombsPerPlayer;
  }

  confirmPlacement(): void {
    if (!this.canConfirmPlacement()) {
      return;
    }

    for (const index of this.placementSelections) {
      this.bombs[index] = true;
    }
    this.placementSelections = [];

    if (this.placingPlayer === 1) {
      this.placingPlayer = 2;
      this.phase = 'handoff';
    } else {
      this.currentEater = 1;
      this.phase = 'eating';
    }
  }

  pickCell(index: number): void {
    if (this.phase !== 'eating' || this.revealed[index] !== null) {
      return;
    }

    if (this.bombs[index]) {
      this.revealed[index] = 'bomb';
      this.loser = this.currentEater;
      this.revealRemainingBombs();
      this.phase = 'ended';
      return;
    }

    this.revealed[index] = 'safe';
    this.currentEater = this.currentEater === 1 ? 2 : 1;
  }

  private revealRemainingBombs(): void {
    for (let i = 0; i < PILE_SIZE; i++) {
      if (this.bombs[i] && this.revealed[i] === null) {
        this.revealed[i] = 'bomb';
      }
    }
  }

  playAgain(): void {
    this.phase = 'setup';
  }
}
