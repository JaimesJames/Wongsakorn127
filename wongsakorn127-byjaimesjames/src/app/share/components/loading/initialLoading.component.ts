import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-initial-loading',
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading" class="flex items-center justify-center">
        <div class="w-16 h-16 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin"></div>
    </div>

  `,

})
export class InitialLoadingComponent {
  @Input() isLoading: boolean = false;
}
