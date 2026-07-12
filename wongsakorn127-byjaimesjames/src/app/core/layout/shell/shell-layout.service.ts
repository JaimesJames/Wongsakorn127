import { Injectable, signal } from '@angular/core';

export interface ShellTitleTarget {
  topOffsetPx: number;
  isLight: boolean;
  visible: boolean;
}

const DEFAULT_TARGET: ShellTitleTarget = {
  topOffsetPx: 200,
  isLight: false,
  visible: false,
};

@Injectable({ providedIn: 'root' })
export class ShellLayoutService {
  readonly target = signal<ShellTitleTarget>(DEFAULT_TARGET);

  setTarget(topOffsetPx: number, isLight: boolean): void {
    this.target.set({ topOffsetPx, isLight, visible: true });
  }

  hide(): void {
    this.target.update((current) => ({ ...current, visible: false }));
  }
}
