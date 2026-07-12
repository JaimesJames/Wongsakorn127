import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigatorComponent } from './core/layout/navigator/navigator.component';
import { HeadComponent } from './core/layout/head/head.component';
import { CreditBadgeComponent } from './share/components/badges/creditBadge/creditBadge.component';
import { ShellLayoutService } from './core/layout/shell/shell-layout.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigatorComponent, HeadComponent, CreditBadgeComponent],
  styleUrl: './app.component.css',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'wongsakorn127-byjaimesjames';
  shellTarget;

  constructor(private shellLayout: ShellLayoutService) {
    this.shellTarget = this.shellLayout.target;
  }
}
