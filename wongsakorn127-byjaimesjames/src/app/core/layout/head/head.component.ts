import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit } from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../adapters/angular/routers/auth/auth.service';

@Component({
  selector: 'app-head',
  imports: [CommonModule],
  templateUrl: './head.component.html',
  styleUrl: './head.component.css'
})
export class HeadComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public router: Router,
  ) { }
  username: string | null = null;
  userProfile: string | null = null
  isAuth: boolean = false
  isLoging: boolean = false
  isLoading: boolean = false
  isHome: boolean = false
  toggle: boolean = false
  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(async (event: NavigationEnd) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        this.isAuth = url.includes('/auth') || !url.includes('/');
        this.isHome = url.includes('/home') || !url.includes('/');
        try {
          this.isLoading = true
          const user = await this.authService.getUserInfomation()
          if (user) {
            this.username = user.displayName
            this.userProfile = user.photoURL
            this.isLoging = true
          }
        } catch (error) {

        }
        finally{
          setTimeout(() => {
            this.isLoading = false
          }, 2000);
          
        }

      });
  }
  logOutBtn() {
    this.toggle = false
    this.authService.logout().then(() => {
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/auth']).then(() => {
        window.location.reload(); // รีโหลดหลัง navigate
      });
    });
  }
}
