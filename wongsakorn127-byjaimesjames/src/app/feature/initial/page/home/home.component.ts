import { Component } from '@angular/core';
import { ShellComponent } from '../../../../core/layout/shell/shell.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [ShellComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {
}
