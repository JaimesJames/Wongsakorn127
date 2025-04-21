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
  currentPath: string = '/home'

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.currentPath = event.url
      if(event.url === '/auth') this.status = 'hide'
      if(event.url === '/home') this.status = 'show'
    });
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      this.status = 'pre-hide';
      if (mode === 'edit') {
        this.status = 'hide';
      } else if (mode === 'game') {
        this.status = 'pre-hide';
      }
    });
  }

  setNavStatus() {
    if (this.status === 'pre-hide') this.status = 'show';
    else if (this.status === 'show') this.status = 'pre-hide';
  }
}
