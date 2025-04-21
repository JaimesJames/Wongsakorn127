import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CoreGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    this.router.navigate(['/home']);
    return false;
  }
}