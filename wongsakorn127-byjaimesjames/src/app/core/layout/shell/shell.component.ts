import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditBadgeComponent } from '../../../share/components/badges/creditBadge/creditBadge.component';
import { ShellLayoutService } from './shell-layout.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, CreditBadgeComponent],
  templateUrl: './shell.component.html',
})
export class ShellComponent implements OnChanges {
  @Input() isLight = false;
  @Input() contentAlign: 'top' | 'center' = 'top';
  @Input() titleOffsetPx = 200;

  constructor(private shellLayout: ShellLayoutService) {}

  ngOnChanges(): void {
    if (this.contentAlign === 'top') {
      this.shellLayout.setTarget(this.titleOffsetPx, this.isLight);
    } else {
      this.shellLayout.hide();
    }
  }
}
