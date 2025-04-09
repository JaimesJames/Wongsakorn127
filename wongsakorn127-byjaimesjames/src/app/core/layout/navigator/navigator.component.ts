import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navigator',
  imports: [CommonModule],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.css',
  standalone: true
})
export class NavigatorComponent implements OnInit {
  status: boolean = false;

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url === "/") {
        this.status = true;
      } else {
        this.status = false;
      }
      console.log(this.status, this.router.url);
    });
  }
  
  getRange(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
}
