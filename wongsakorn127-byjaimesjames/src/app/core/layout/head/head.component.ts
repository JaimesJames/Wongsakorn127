import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnChanges, OnInit, PLATFORM_ID } from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../adapters/angular/routers/auth/auth.service';

@Component({
  selector: 'app-head',
  imports: [CommonModule],
  templateUrl: './head.component.html',
})
export class HeadComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
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

          if (isPlatformBrowser(this.platformId)) {
            const user = await this.authService.getUserInfomation()
            if (user) {
              this.username = user.username
              this.userProfile = user.userProfile
              this.isLoging = true
            }
          }
        } catch (error) {

        }
        finally {

        }

      });
  }
  logOutBtn() {
    this.toggle = false
    this.authService.logout().then(() => {
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/auth'])
    });
  }
}
