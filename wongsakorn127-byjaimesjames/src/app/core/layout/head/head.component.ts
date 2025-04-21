import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../share/services/auth/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-head',
  imports: [CommonModule],
  templateUrl: './head.component.html',
  styleUrl: './head.component.css'
})
export class HeadComponent {
  constructor(public authService: AuthService, public router: Router) {}
  username: string | null = null;
  isAuth: boolean = false
  ngOnInit(): void {
    this.authService.username$.subscribe((name) => {
      this.username = name;
    });
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      if(event.url === '/auth') this.isAuth = true 

    });

  }
  logOutBtn(){
    this.authService.logout()
    window.location.reload();
  }
}
