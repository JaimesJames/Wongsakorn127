import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'home',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'auth',
    renderMode: RenderMode.Client
  },
  {
    path: 'nosy-game',
    renderMode: RenderMode.Client
  },
  {
    path: 'kinglee-game',
    renderMode: RenderMode.Client
  },
  {
    path: 'spin-it',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
