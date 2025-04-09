import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/initial/page/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./core/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'nosy-game',
    loadComponent: () => import('./feature/nosyGame/page/nosygame/nosygame.component').then(m => m.NosygameComponent)
  }
];
