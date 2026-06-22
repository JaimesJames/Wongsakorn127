import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkOverlayOrigin, ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { ColorPickerDirective } from 'ngx-color-picker';
import { CreditBadgeComponent } from '../../../../share/components/badges/creditBadge/creditBadge.component';

@Component({
  selector: 'app-spinitgame',
  imports: [CommonModule, FormsModule, OverlayModule, ColorPickerDirective, CreditBadgeComponent],
  templateUrl: './spinitgame.component.html',
  styleUrl: './spinitgame.component.css',
  standalone: true
})
export class SpinitgameComponent implements OnInit, OnDestroy {
  namesText = 'var1\nvar2\nvar3';
  rotation = 0;
  isSpinning = false;
  isColorMode = false;
  activeColorPickerIndex: number | null = null;
  activeColorOrigin: CdkOverlayOrigin | null = null;
  pickerHexValue = '#4C1D95';
  winner = '';
  palette = ['#4C1D95', '#7C3AED', '#A855F7'];
  personColors: string[] = [];
  lockedColors: boolean[] = [];
  readonly colorPickerPositions: ConnectedPosition[] = [
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'top' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'bottom' }
  ];

  private resultTimer?: ReturnType<typeof setTimeout>;
  private syncedNames: string[] = [];
  private previewOriginalColors: Record<number, string> = {};
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

  labelAngle(index: number): number {
    return ((index + 0.5) * 360 / this.names.length) - 90;
  }

  ngOnInit(): void {
    this.loadCache();
    this.syncedNames = [...this.names];
    this.syncPeopleColors();
  }

  onNamesChange(): void {
    this.winner = '';
    this.syncPeopleColors();
    this.saveCache();
  }

  toggleColorMode(): void {
    this.isColorMode = !this.isColorMode;
    this.activeColorPickerIndex = null;
    this.activeColorOrigin = null;
    this.syncPeopleColors();
  }

  colorFor(index: number): string {
    return this.personColors[index] || this.palette[index % this.palette.length];
  }

  get activePersonColor(): string {
    if (this.activeColorPickerIndex === null) return this.palette[0];
    return this.colorFor(this.activeColorPickerIndex);
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

  updatePersonColor(index: number, color: string): void {
    if (!this.hasPaletteColor(color)) {
      this.palette.push(color);
    }

    this.personColors[index] = color;
    delete this.previewOriginalColors[index];
    this.activeColorPickerIndex = null;
    this.activeColorOrigin = null;
    this.saveCache();
  }

  togglePersonColorPicker(index: number, origin: CdkOverlayOrigin): void {
    if (this.activeColorPickerIndex === index) {
      this.cancelActiveColorPicker();
      return;
    }
    if (this.activeColorPickerIndex !== null) this.cancelActiveColorPicker();

    this.activeColorPickerIndex = index;
    this.activeColorOrigin = origin;
    this.startPersonColorPreview(index);
    this.pickerHexValue = this.colorFor(index);
  }

  selectPersonPaletteColor(index: number, color: string): void {
    this.personColors[index] = color;
    delete this.previewOriginalColors[index];
    this.activeColorPickerIndex = null;
    this.activeColorOrigin = null;
    this.saveCache();
  }

  selectActivePersonPaletteColor(color: string): void {
    if (this.activeColorPickerIndex === null) return;
    this.pickerHexValue = color;
    this.previewPersonColor(this.activeColorPickerIndex, color);
  }

  previewActivePersonColor(color: string): void {
    if (this.activeColorPickerIndex === null) return;
    this.pickerHexValue = color;
    this.previewPersonColor(this.activeColorPickerIndex, color);
  }

  previewActiveHexColor(color: string): void {
    this.pickerHexValue = color;
    if (!this.isPickerHexValid || this.activeColorPickerIndex === null) return;
    this.previewPersonColor(this.activeColorPickerIndex, color);
  }

  get isPickerHexValid(): boolean {
    return /^#[0-9a-f]{6}$/i.test(this.pickerHexValue);
  }

  get confirmTextColor(): '#000000' | '#FFFFFF' {
    if (!this.isPickerHexValid) return '#FFFFFF';

    const channels = this.pickerHexValue.slice(1).match(/.{2}/g)!.map(value => parseInt(value, 16) / 255);
    const [red, green, blue] = channels.map(channel =>
      channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
    );
    const luminance = (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
    const whiteContrast = 1.05 / (luminance + 0.05);
    const blackContrast = (luminance + 0.05) / 0.05;

    return blackContrast >= whiteContrast ? '#000000' : '#FFFFFF';
  }

  confirmActivePersonColor(color: string): void {
    if (this.activeColorPickerIndex === null) return;
    this.updatePersonColor(this.activeColorPickerIndex, color);
  }

  cancelActiveColorPicker(): void {
    if (this.activeColorPickerIndex === null) return;
    this.cancelPersonColorPreview(this.activeColorPickerIndex);
    this.activeColorPickerIndex = null;
    this.activeColorOrigin = null;
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

  private syncPeopleColors(): void {
    const names = this.names;
    const previous = this.syncedNames.map((name, index) => ({
      name,
      color: this.personColors[index],
      locked: this.lockedColors[index],
      used: false
    }));

    this.personColors = names.map((name, index) => {
      const match = previous.find(item => !item.used && item.name === name);
      if (match) {
        match.used = true;
        return match.color || this.palette[index % this.palette.length];
      }
      return this.palette[index % this.palette.length];
    });
    this.lockedColors = names.map(name => {
      const match = previous.find(item => item.used && item.name === name);
      if (!match) return false;
      match.used = false;
      return !!match.locked;
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
      lockedColors: this.lockedColors
    }));
  }
}
