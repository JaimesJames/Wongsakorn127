import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Selector } from '../../models/share.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-selection-bar',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="relative inline-block w-full outline-none">
    <select id="options" [(ngModel)]="initSelected" (change)="onSelect($event)" class="block w-full rounded-full border-2 border-white p-2.5 px-5 text-white appearance-none outline-none focus:outline-none">
      <option *ngFor="let selector of selectors" [value]="selector.selectorId" class="text-black bg-white">{{ selector.text }}</option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 outline-none">
      <svg class="h-4 w-4 text-light-bg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
  `,
  styles: `
  `,
  standalone: true
})
export class selectionBarComponent {
  @Input() selectors: Selector[] = []
  @Input() initSelected: string = ""

  @Output() selected = new EventEmitter();


  onSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    const text = select.options[select.selectedIndex]?.text;
    this.selected.emit({ value, text });
  }

}