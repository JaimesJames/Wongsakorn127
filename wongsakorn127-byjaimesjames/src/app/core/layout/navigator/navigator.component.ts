import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navigator',
  imports: [CommonModule, RouterModule],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.css',
  standalone: true
})
export class NavigatorComponent implements OnInit {
  status: string = 'hide';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const isHome = this.router.url === "/";
        const childRoute = this.getChild(this.route);
        childRoute.queryParams.subscribe(params => {
          const mode = params['mode'];
          console.log(isHome)
          if (mode == 'edit') {
            this.status = "hide"; 
          }
          else if (mode == 'game') {
            this.status = "pre-hide"; 
          } else {
            this.status = "show";
          }
        });
      });
  }

  getChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
  getRange(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
}
