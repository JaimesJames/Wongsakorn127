import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navigator',
  imports: [CommonModule, RouterModule],
  templateUrl: './navigator.component.html',
  styles: `
      .hide-scrollbar::-webkit-scrollbar {
      display: none;
      }

      /* ซ่อน scrollbar บน Firefox */
      .hide-scrollbar {
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none;  /* IE and Edge */
      }
`,
  standalone: true
})
export class NavigatorComponent implements OnInit {
  status: string = 'hide';
  isclicked: boolean = false

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      const currentUrl = this.router.url.split('?')[0];
      this.status = 'show';
      setTimeout(() => {
        if (mode === 'edit') {
          this.status = 'hide';
        } else if (mode === 'game') {
          this.status = 'pre-hide';
        } else if (currentUrl === '/') {
          this.status = 'show';
        }
      }, 500);


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

  setNavStatus() {
    if (this.status === 'pre-hide') this.status = 'show';
    else if (this.status === 'show') this.status = 'pre-hide';
  }
}
