import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Selector } from '../../models/share.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-selection-bar',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-64 m-auto mt-10">
        <select id="options" [(ngModel)]="initSelected" (change)="onSelect($event)" class="block w-full rounded-lg border border-white p-2.5 text-white">
            <option *ngFor="let selector of selectors" [value]="selector.selectorId" class="text-black bg-white">{{ selector.text }}</option>
        </select>
    </div>
  `,
  styles: `
  `,
  standalone:true
})
export class selectionBarComponent {
    @Input() selectors:Selector[] = []
    @Input() initSelected:string = ""

    @Output() selected = new EventEmitter<string>();

    ngOnInit() {
        this.selected.emit(this.initSelected)
    }
    onSelect(event: Event) {
        const value = (event.target as HTMLSelectElement).value;
        this.selected.emit(value);
    }

}