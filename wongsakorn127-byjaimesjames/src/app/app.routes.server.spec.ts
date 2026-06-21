import { RenderMode } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';

describe('serverRoutes', () => {
  it('server-renders routes whose behavior depends on query parameters', () => {
    const renderModes = new Map(
      serverRoutes.map(route => [route.path, route.renderMode]),
    );

    expect(renderModes.get('auth')).toBe(RenderMode.Server);
    expect(renderModes.get('nosy-game')).toBe(RenderMode.Server);
    expect(renderModes.get('kinglee-game')).toBe(RenderMode.Server);
  });

  it('keeps static landing routes prerendered', () => {
    const renderModes = new Map(
      serverRoutes.map(route => [route.path, route.renderMode]),
    );

    expect(renderModes.get('')).toBe(RenderMode.Prerender);
    expect(renderModes.get('home')).toBe(RenderMode.Prerender);
  });
});
