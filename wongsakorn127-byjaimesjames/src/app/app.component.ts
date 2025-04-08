import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  styleUrl: './app.component.css',
  template: `
    <main class="min-h-screen bg-gray-100 p-4">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  title = 'wongsakorn127-byjaimesjames';
}
