import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white p-6 rounded-4xl shadow-xl w-full max-w-sm">
            <h2 class="text-lg font-semibold mb-3">{{ title }}</h2>
            <p class="text-sm text-gray-600 mb-5">{{ message }}</p>
            <div class="flex justify-center space-x-3">
                <button (click)="cancel()" class="w-full px-4 py-3 rounded-full border-[#D966BC] hover:border-[#D966BC] border-2 text-[#D966BC] text-sm font-semibold">
                    Cancel
                </button>
            </div>
        </div>
    </div>
    `
})
export class AlertDialogComponent {
  title = 'Are you sure?';
  message = 'Do you want to proceed?';
  visible = false;

  private resolveFn: ((value: boolean) => void) | null = null;

  open(title: string, message: string): Promise<boolean> {
    this.title = title;
    this.message = message;
    this.visible = true;

    return new Promise<boolean>((resolve) => {
      this.resolveFn = resolve;
    });
  }

  cancel() {
    this.visible = false;
    this.resolveFn?.(false);
    this.resolveFn = null;
  }
}