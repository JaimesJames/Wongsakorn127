import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-credit-badge',
  imports: [CommonModule],
  template: `
  <div [ngClass]="{'text-text-bgdark':!isLight, 'text-text-bglight':isLight}" class="text-center flex flex-col gap-[10px]">
    <h2 class="text-4xl font-semibold">Wongsakorn127</h2>
    <p class="text-lg font-medium">by JaimesJames</p>
  </div>
  `,
  styles: ``,
  standalone:true
})
export class CreditBadgeComponent {
  @Input() isLight = false
}
