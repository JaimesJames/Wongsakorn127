import { Component } from '@angular/core';
import { CreditBadgeComponent } from '../../../../share/components/badges/creditBadge/creditBadge.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CreditBadgeComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {
  isLoading:boolean = false
}
