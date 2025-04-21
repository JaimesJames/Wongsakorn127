import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigatorComponent } from './core/layout/navigator/navigator.component';
import { HeadComponent } from './core/layout/head/head.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigatorComponent, HeadComponent],
  styleUrl: './app.component.css',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'wongsakorn127-byjaimesjames';
}
