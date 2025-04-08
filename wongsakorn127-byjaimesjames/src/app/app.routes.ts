import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./login-register/login-register.component').then(m => m.LoginRegisterComponent)
      }
];
