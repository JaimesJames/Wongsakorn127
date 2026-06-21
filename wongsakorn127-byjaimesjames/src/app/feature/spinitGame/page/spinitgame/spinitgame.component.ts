import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreditBadgeComponent } from '../../../../share/components/badges/creditBadge/creditBadge.component';

@Component({
  selector: 'app-spinitgame',
  imports: [CommonModule, FormsModule, CreditBadgeComponent],
  templateUrl: './spinitgame.component.html',
  styleUrl: './spinitgame.component.css',
  standalone: true
})
export class SpinitgameComponent implements OnDestroy {
  namesText = 'var1\nvar2\nvar3';
  rotation = 0;
  isSpinning = false;
  winner = '';

  private resultTimer?: ReturnType<typeof setTimeout>;
  private readonly colors = ['#5B21B6', '#7C3AED', '#9333EA', '#6D28D9', '#A855F7', '#4C1D95'];

  get names(): string[] {
    return this.namesText
      .split(/\r?\n/)
      .map(name => name.trim())
      .filter(Boolean);
  }

  get wheelBackground(): string {
    const names = this.names;
    if (names.length === 0) return '#DDD6FE';

    const segmentSize = 360 / names.length;
    const segments = names.map((_, index) => {
      const start = index * segmentSize;
      const end = (index + 1) * segmentSize;
      return `${this.colors[index % this.colors.length]} ${start}deg ${end}deg`;
    });

    return `conic-gradient(${segments.join(', ')})`;
  }

  labelAngle(index: number): number {
    return ((index + 0.5) * 360 / this.names.length) - 90;
  }

  onNamesChange(): void {
    this.winner = '';
  }

  spin(): void {
    const names = this.names;
    if (this.isSpinning || names.length < 2) return;

    const selectedIndex = Math.floor(Math.random() * names.length);
    const segmentCenter = (selectedIndex + 0.5) * 360 / names.length;
    const currentAngle = ((this.rotation % 360) + 360) % 360;
    const targetAngle = (360 - segmentCenter) % 360;
    const distance = (targetAngle - currentAngle + 360) % 360;

    this.winner = '';
    this.isSpinning = true;
    this.rotation += (5 * 360) + distance;

    this.resultTimer = setTimeout(() => {
      this.winner = names[selectedIndex];
      this.isSpinning = false;
    }, 4200);
  }

  ngOnDestroy(): void {
    clearTimeout(this.resultTimer);
  }
}
