import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditBadgeComponent } from '../../../share/components/badges/creditBadge/creditBadge.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, CreditBadgeComponent],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  @Input() isLight = false;
  @Input() contentAlign: 'top' | 'center' = 'top';
}
