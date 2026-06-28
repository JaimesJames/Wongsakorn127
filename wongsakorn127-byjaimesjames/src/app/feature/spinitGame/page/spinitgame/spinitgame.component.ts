import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkOverlayOrigin, ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ColorPickerDirective } from 'ngx-color-picker';
import { CreditBadgeComponent } from '../../../../share/components/badges/creditBadge/creditBadge.component';

@Component({
  selector: 'app-spinitgame',
  imports: [CommonModule, FormsModule, OverlayModule, DragDropModule, ColorPickerDirective, CreditBadgeComponent],
  templateUrl: './spinitgame.component.html',
  styleUrl: './spinitgame.component.css',
  standalone: true
})
export class SpinitgameComponent implements OnInit, OnDestroy {
  namesText = 'var1\nvar2\nvar3';
  rotation = 0;
  dramaLevel = 3;
  removeWinnerAfterSpin = false;
  isSpinning = false;
  isDraggingWheel = false;
  isPaletteDragging = false;
  isSettingsOpen = false;
  isColorMode = false;
  activeColorPickerIndex: number | null = null;
  activePaletteColorIndex: number | null = null;
  isAddingPaletteColor = false;
  activeColorOrigin: CdkOverlayOrigin | null = null;
  pickerHexValue = '#4C1D95';
  winner = '';
  pendingWinnerIndex: number | null = null;
  palette = ['#4C1D95', '#7C3AED', '#A855F7'];
  personColors: string[] = [];
  lockedColors: boolean[] = [];
  readonly dramaLabels = ['Quick', 'Short', 'Balanced', 'Dramatic', 'Maximum'];
  readonly colorPickerPositions: ConnectedPosition[] = [
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'top' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'bottom' }
  ];

  private spinFrame?: number;
  private idleFrame?: number;
  private idleResumeAt = 0;
  private spinVelocity = 0;
  private lastSpinFrameTime = 0;
  private lastIdleFrameTime = 0;
  private readonly initialSpinVelocity = 540;
  private readonly spinBoostVelocity = 240;
  private readonly maxSpinVelocity = 2160;
  private readonly stopSpinVelocity = 12;
  private readonly idleSpinVelocity = 4;
  private readonly idleDelayAfterSpinMs = 3000;
  private dragPointerId: number | null = null;
  private dragCenter = { x: 0, y: 0 };
  private dragLastAngle = 0;
  private dragLastTime = 0;
  private dragVelocity = 0;
  private dragDistance = 0;
  private syncedNames: string[] = [];
  private previewOriginalColors: Record<number, string> = {};
  private palettePreview?: { index: number; color: string; personColors: string[] };
  private readonly cacheKey = 'spin-it-settings-v3';

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
      return `${this.colorFor(index)} ${start}deg ${end}deg`;
    });

    return `conic-gradient(${segments.join(', ')})`;
  }

  get dramaLabel(): string {
    return this.dramaLabels[this.dramaLevel - 1];
  }

  labelAngle(index: number): number {
    return ((index + 0.5) * 360 / this.names.length) - 90;
  }

  ngOnInit(): void {
    this.loadCache();
    this.syncedNames = [...this.names];
    this.syncPeopleColors();
    this.startIdleSpin();
  }

  onNamesChange(): void {
    this.winner = '';
    this.pendingWinnerIndex = null;
    this.syncPeopleColors();
    this.saveCache();
  }

  toggleColorMode(): void {
    this.isColorMode = !this.isColorMode;
    this.cancelActiveColorPicker();
    this.syncPeopleColors();
  }

  openSettings(): void {
    this.isSettingsOpen = true;
  }

  closeSettings(): void {
    this.isSettingsOpen = false;
    this.cancelActiveColorPicker();
  }

  colorFor(index: number): string {
    return this.personColors[index] || this.palette[index % this.palette.length];
  }

  get isColorPickerOpen(): boolean {
    return this.activeColorPickerIndex !== null || this.activePaletteColorIndex !== null || this.isAddingPaletteColor;
  }

  get activePickerColor(): string {
    if (this.activeColorPickerIndex !== null) return this.colorFor(this.activeColorPickerIndex);
    if (this.activePaletteColorIndex !== null) return this.palette[this.activePaletteColorIndex];
    return this.pickerHexValue;
  }

  addPaletteColor(color: string): void {
    if (this.hasPaletteColor(color)) return;

    this.palette.push(color);
    this.applyPaletteToUnlocked();
    this.saveCache();
  }

  updatePaletteColor(index: number, color: string): void {
    const previousColor = this.palette[index];
    this.palette[index] = color;
    this.personColors = this.personColors.map(personColor =>
      personColor.toLowerCase() === previousColor.toLowerCase() ? color : personColor
    );
    this.saveCache();
  }

  removePaletteColor(index: number): void {
    if (this.palette.length === 1) return;

    const [removedColor] = this.palette.splice(index, 1);
    this.personColors = this.personColors.map(personColor => {
      if (personColor.toLowerCase() !== removedColor.toLowerCase()) return personColor;
      return this.palette[Math.floor(Math.random() * this.palette.length)];
    });
    this.saveCache();
  }

  reorderPalette(event: CdkDragDrop<string[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(this.palette, event.previousIndex, event.currentIndex);
    this.applyPaletteToUnlocked();
    this.saveCache();
  }

  startPaletteDrag(): void {
    this.isPaletteDragging = true;
    this.cancelActiveColorPicker();
  }

  endPaletteDrag(): void {
    setTimeout(() => this.isPaletteDragging = false);
  }

  updatePersonColor(index: number, color: string): void {
    if (!this.hasPaletteColor(color)) {
      this.palette.push(color);
    }

    this.personColors[index] = color;
    this.lockedColors[index] = true;
    delete this.previewOriginalColors[index];
    this.activeColorPickerIndex = null;
    this.activePaletteColorIndex = null;
    this.isAddingPaletteColor = false;
    this.activeColorOrigin = null;
    this.saveCache();
  }

  togglePersonColorPicker(index: number, origin: CdkOverlayOrigin): void {
    if (this.activeColorPickerIndex === index && !this.isAddingPaletteColor && this.activePaletteColorIndex === null) {
      this.cancelActiveColorPicker();
      return;
    }
    if (this.isColorPickerOpen) this.cancelActiveColorPicker();

    this.activeColorPickerIndex = index;
    this.activeColorOrigin = origin;
    this.startPersonColorPreview(index);
    this.pickerHexValue = this.colorFor(index);
  }

  togglePaletteColorPicker(index: number | null, origin: CdkOverlayOrigin): void {
    if (this.isPaletteDragging) return;
    const isSameTarget = index === null
      ? this.isAddingPaletteColor
      : this.activePaletteColorIndex === index;
    if (isSameTarget) {
      this.cancelActiveColorPicker();
      return;
    }
    if (this.isColorPickerOpen) this.cancelActiveColorPicker();

    this.activePaletteColorIndex = index;
    this.isAddingPaletteColor = index === null;
    this.activeColorOrigin = origin;
    this.pickerHexValue = index === null ? '#EC4899' : this.palette[index];
    if (index !== null) {
      this.palettePreview = {
        index,
        color: this.palette[index],
        personColors: [...this.personColors]
      };
    }
  }

  selectPersonPaletteColor(index: number, color: string): void {
    this.personColors[index] = color;
    delete this.previewOriginalColors[index];
    this.activeColorPickerIndex = null;
    this.activeColorOrigin = null;
    this.saveCache();
  }

  selectActivePaletteColor(color: string): void {
    this.pickerHexValue = color;
    this.previewActiveColor(color);
  }

  previewActiveColor(color: string): void {
    this.pickerHexValue = color;
    if (this.activeColorPickerIndex !== null) {
      this.previewPersonColor(this.activeColorPickerIndex, color);
    } else if (this.activePaletteColorIndex !== null) {
      this.previewPaletteColor(color);
    }
  }

  previewActiveHexColor(color: string): void {
    this.pickerHexValue = color;
    if (!this.isPickerHexValid) return;
    this.previewActiveColor(color);
  }

  get isPickerHexValid(): boolean {
    return /^#[0-9a-f]{6}$/i.test(this.pickerHexValue);
  }

  get confirmTextColor(): '#000000' | '#FFFFFF' {
    return this.textColorFor(this.pickerHexValue);
  }

  textColorFor(backgroundColor: string): '#000000' | '#FFFFFF' {
    if (!/^#[0-9a-f]{6}$/i.test(backgroundColor)) return '#FFFFFF';

    const channels = backgroundColor.slice(1).match(/.{2}/g)!.map(value => parseInt(value, 16) / 255);
    const [red, green, blue] = channels.map(channel =>
      channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
    );
    const luminance = (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
    const whiteContrast = 1.05 / (luminance + 0.05);
    const blackContrast = (luminance + 0.05) / 0.05;

    return blackContrast >= whiteContrast ? '#000000' : '#FFFFFF';
  }

  confirmActiveColor(color: string): void {
    if (this.activeColorPickerIndex !== null) {
      this.updatePersonColor(this.activeColorPickerIndex, color);
      return;
    }
    if (this.activePaletteColorIndex !== null) {
      const index = this.activePaletteColorIndex;
      this.restorePalettePreview();
      this.updatePaletteColor(index, color);
    } else if (this.isAddingPaletteColor) {
      this.addPaletteColor(color);
    }
    this.closeColorPicker();
  }

  cancelActiveColorPicker(): void {
    if (this.activeColorPickerIndex !== null) {
      this.cancelPersonColorPreview(this.activeColorPickerIndex);
    }
    this.restorePalettePreview();
    this.closeColorPicker();
  }

  private closeColorPicker(): void {
    this.activeColorPickerIndex = null;
    this.activePaletteColorIndex = null;
    this.isAddingPaletteColor = false;
    this.activeColorOrigin = null;
  }

  private previewPaletteColor(color: string): void {
    if (!this.palettePreview) return;

    const { index, color: originalColor, personColors } = this.palettePreview;
    this.palette[index] = color;
    this.personColors = personColors.map(personColor =>
      personColor.toLowerCase() === originalColor.toLowerCase() ? color : personColor
    );
  }

  private restorePalettePreview(): void {
    if (!this.palettePreview) return;

    this.palette[this.palettePreview.index] = this.palettePreview.color;
    this.personColors = this.palettePreview.personColors;
    this.palettePreview = undefined;
  }

  startPersonColorPreview(index: number): void {
    this.previewOriginalColors[index] = this.colorFor(index);
  }

  previewPersonColor(index: number, color: string): void {
    this.personColors[index] = color;
  }

  cancelPersonColorPreview(index: number): void {
    const originalColor = this.previewOriginalColors[index];
    if (!originalColor) return;

    this.personColors[index] = originalColor;
    delete this.previewOriginalColors[index];
  }

  toggleColorLock(index: number): void {
    this.lockedColors[index] = !this.lockedColors[index];
    this.saveCache();
  }

  onDramaLevelChange(): void {
    this.saveCache();
  }

  onRemoveWinnerAfterSpinChange(): void {
    this.saveCache();
  }

  closeWinnerModal(): void {
    const winnerIndex = this.pendingWinnerIndex;
    this.winner = '';
    this.pendingWinnerIndex = null;

    if (this.removeWinnerAfterSpin && winnerIndex !== null) {
      this.removeNameAt(winnerIndex);
    }
  }

  onWheelPointerDown(event: PointerEvent): void {
    if (this.isSpinning || this.names.length < 2) return;

    const wheel = event.currentTarget as HTMLElement;
    const bounds = wheel.getBoundingClientRect();
    this.dragCenter = {
      x: bounds.left + (bounds.width / 2),
      y: bounds.top + (bounds.height / 2)
    };
    this.dragPointerId = event.pointerId;
    this.dragLastAngle = this.pointerAngle(event);
    this.dragLastTime = event.timeStamp;
    this.dragVelocity = 0;
    this.dragDistance = 0;
    this.isDraggingWheel = true;
    this.winner = '';
    this.pendingWinnerIndex = null;
    wheel.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  onWheelPointerMove(event: PointerEvent): void {
    if (!this.isDraggingWheel || event.pointerId !== this.dragPointerId) return;

    const angle = this.pointerAngle(event);
    const angleDelta = this.normalizedAngle(angle - this.dragLastAngle);
    const elapsed = Math.max(1, event.timeStamp - this.dragLastTime);
    const instantVelocity = angleDelta / elapsed;

    this.rotation += angleDelta;
    this.dragVelocity = (this.dragVelocity * 0.35) + (instantVelocity * 0.65);
    this.dragDistance += Math.abs(angleDelta);
    this.dragLastAngle = angle;
    this.dragLastTime = event.timeStamp;
    event.preventDefault();
  }

  onWheelPointerUp(event: PointerEvent): void {
    if (!this.isDraggingWheel || event.pointerId !== this.dragPointerId) return;

    const releasedQuickly = (event.timeStamp - this.dragLastTime) < 120;
    const shouldSpin = releasedQuickly && Math.abs(this.dragVelocity) >= 0.18 && this.dragDistance >= 12;
    this.finishWheelDrag(event);

    if (shouldSpin) this.spinFromVelocity(this.dragVelocity);
  }

  onWheelPointerCancel(event: PointerEvent): void {
    if (event.pointerId !== this.dragPointerId) return;
    this.finishWheelDrag(event);
  }

  spin(): void {
    if (this.names.length < 2) return;

    const direction = Math.sign(this.spinVelocity) || 1;
    const boost = this.isSpinning ? this.spinBoostVelocity : this.initialSpinVelocity;
    const speed = Math.min(Math.abs(this.spinVelocity) + boost, this.maxSpinVelocity);
    this.startPhysicsSpin(direction * speed);
  }

  ngOnDestroy(): void {
    if (this.spinFrame !== undefined) cancelAnimationFrame(this.spinFrame);
    if (this.idleFrame !== undefined) cancelAnimationFrame(this.idleFrame);
  }

  private startIdleSpin(): void {
    if (this.idleFrame !== undefined) return;

    this.lastIdleFrameTime = 0;
    this.idleFrame = requestAnimationFrame(time => this.advanceIdleSpin(time));
  }

  private advanceIdleSpin(time: number): void {
    if (!this.lastIdleFrameTime) {
      this.lastIdleFrameTime = time;
      this.idleFrame = requestAnimationFrame(nextTime => this.advanceIdleSpin(nextTime));
      return;
    }

    const elapsedSeconds = Math.min((time - this.lastIdleFrameTime) / 1000, 0.05);
    if (!this.isSpinning && !this.isDraggingWheel && this.names.length >= 2 && time >= this.idleResumeAt) {
      this.rotation += this.idleSpinVelocity * elapsedSeconds;
    }
    this.lastIdleFrameTime = time;
    this.idleFrame = requestAnimationFrame(nextTime => this.advanceIdleSpin(nextTime));
  }

  private spinFromVelocity(velocity: number): void {
    const direction = Math.sign(velocity) || 1;
    const speed = Math.min(
      Math.max(Math.abs(velocity) * 1000, this.initialSpinVelocity),
      this.maxSpinVelocity
    );
    this.startPhysicsSpin(direction * speed);
  }

  private startPhysicsSpin(velocity: number): void {
    this.winner = '';
    this.pendingWinnerIndex = null;
    this.isSpinning = true;
    this.spinVelocity = velocity;

    if (this.spinFrame === undefined) {
      this.lastSpinFrameTime = 0;
      this.spinFrame = requestAnimationFrame(time => this.advanceSpin(time));
    }
  }

  private advanceSpin(time: number): void {
    if (!this.lastSpinFrameTime) {
      this.lastSpinFrameTime = time;
      this.spinFrame = requestAnimationFrame(nextTime => this.advanceSpin(nextTime));
      return;
    }

    const elapsedSeconds = Math.min((time - this.lastSpinFrameTime) / 1000, 0.05);
    const direction = Math.sign(this.spinVelocity) || 1;
    const currentSpeed = Math.abs(this.spinVelocity);
    const resistance = currentSpeed > 360
      ? 220 + (currentSpeed * 0.7)
      : currentSpeed > 90
        ? 100 + (currentSpeed * 0.45)
        : this.lowSpeedResistance(currentSpeed);
    const nextSpeed = Math.max(0, currentSpeed - (resistance * elapsedSeconds));

    this.rotation += this.spinVelocity * elapsedSeconds;
    this.spinVelocity = direction * nextSpeed;
    this.lastSpinFrameTime = time;

    if (nextSpeed <= this.stopSpinVelocity) {
      this.spinVelocity = 0;
      this.spinFrame = undefined;
      this.lastSpinFrameTime = 0;
      this.isSpinning = false;
      const winnerIndex = this.indexAtPointer();
      this.pendingWinnerIndex = winnerIndex;
      this.winner = this.names[winnerIndex] || '';
      this.idleResumeAt = time + this.idleDelayAfterSpinMs;
      return;
    }

    this.spinFrame = requestAnimationFrame(nextTime => this.advanceSpin(nextTime));
  }

  private lowSpeedResistance(speed: number): number {
    const profiles = [
      { base: 120, drag: 0.8 },
      { base: 70, drag: 0.6 },
      { base: 30, drag: 0.4 },
      { base: 8, drag: 0.2 },
      { base: 2, drag: 0.07 }
    ];
    const profile = profiles[this.dramaLevel - 1] || profiles[2];
    return profile.base + (speed * profile.drag);
  }

  private indexAtPointer(): number {
    const segmentSize = 360 / this.names.length;
    const normalizedRotation = ((this.rotation % 360) + 360) % 360;
    const wheelAngleAtPointer = (360 - normalizedRotation) % 360;
    return Math.floor(wheelAngleAtPointer / segmentSize) % this.names.length;
  }

  private finishWheelDrag(event: PointerEvent): void {
    const wheel = event.currentTarget as HTMLElement;
    if (wheel.hasPointerCapture?.(event.pointerId)) {
      wheel.releasePointerCapture(event.pointerId);
    }
    this.isDraggingWheel = false;
    this.dragPointerId = null;
  }

  private pointerAngle(event: PointerEvent): number {
    return Math.atan2(event.clientY - this.dragCenter.y, event.clientX - this.dragCenter.x) * (180 / Math.PI);
  }

  private normalizedAngle(angle: number): number {
    return ((angle + 540) % 360) - 180;
  }

  private removeNameAt(targetIndex: number): void {
    const lines = this.namesText.split(/\r?\n/);
    let visibleIndex = -1;
    const nextLines = lines.filter(line => {
      if (!line.trim()) return true;

      visibleIndex += 1;
      return visibleIndex !== targetIndex;
    });

    this.namesText = nextLines.join('\n');
    this.personColors.splice(targetIndex, 1);
    this.lockedColors.splice(targetIndex, 1);
    this.syncedNames = this.names;
    this.saveCache();
  }

  private syncPeopleColors(): void {
    const names = this.names;
    const previous = this.syncedNames.map((name, index) => ({
      index,
      name,
      color: this.personColors[index],
      locked: this.lockedColors[index],
      used: false
    }));

    const assignments = names.map(name => {
      const match = previous.find(item => !item.used && item.name === name);
      if (match) {
        match.used = true;
      }
      return match;
    });

    assignments.forEach((assignment, index) => {
      if (assignment) return;

      const renamedRow = previous.find(item => !item.used && item.index === index);
      if (renamedRow) {
        renamedRow.used = true;
        assignments[index] = renamedRow;
      }
    });

    this.personColors = assignments.map((assignment, index) =>
      assignment?.color || this.palette[index % this.palette.length]
    );
    this.lockedColors = assignments.map(assignment => {
      return !!assignment?.locked;
    });
    this.syncedNames = [...names];
  }

  private applyPaletteToUnlocked(): void {
    this.names.forEach((_, index) => {
      if (!this.lockedColors[index]) {
        this.personColors[index] = this.palette[index % this.palette.length];
      }
    });
  }

  private hasPaletteColor(color: string): boolean {
    return this.palette.some(item => item.toLowerCase() === color.toLowerCase());
  }

  private loadCache(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const cached = JSON.parse(localStorage.getItem(this.cacheKey) || 'null');
      if (!cached) return;

      this.namesText = typeof cached.namesText === 'string' ? cached.namesText : this.namesText;
      this.palette = Array.isArray(cached.palette) && cached.palette.length ? cached.palette : this.palette;
      this.personColors = Array.isArray(cached.personColors) ? cached.personColors : [];
      this.lockedColors = Array.isArray(cached.lockedColors) ? cached.lockedColors : [];
      this.dramaLevel = Number.isInteger(cached.dramaLevel) && cached.dramaLevel >= 1 && cached.dramaLevel <= 5
        ? cached.dramaLevel
        : this.dramaLevel;
      this.removeWinnerAfterSpin = typeof cached.removeWinnerAfterSpin === 'boolean'
        ? cached.removeWinnerAfterSpin
        : this.removeWinnerAfterSpin;
    } catch {
      localStorage.removeItem(this.cacheKey);
    }
  }

  private saveCache(): void {
    if (typeof localStorage === 'undefined') return;

    // TODO(tech-debt): persist Spin It settings to the user's database account when logged in.
    localStorage.setItem(this.cacheKey, JSON.stringify({
      namesText: this.namesText,
      palette: this.palette,
      personColors: this.personColors,
      lockedColors: this.lockedColors,
      dramaLevel: this.dramaLevel,
      removeWinnerAfterSpin: this.removeWinnerAfterSpin
    }));
  }
}
