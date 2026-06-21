import { RenderMode } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';

describe('serverRoutes', () => {
  it('client-renders interactive routes that depend on query parameters', () => {
    const renderModes = new Map(
      serverRoutes.map(route => [route.path, route.renderMode]),
    );

    expect(renderModes.get('auth')).toBe(RenderMode.Client);
    expect(renderModes.get('nosy-game')).toBe(RenderMode.Client);
    expect(renderModes.get('kinglee-game')).toBe(RenderMode.Client);
    expect(renderModes.get('**')).toBe(RenderMode.Client);
  });

  it('keeps static landing routes prerendered', () => {
    const renderModes = new Map(
      serverRoutes.map(route => [route.path, route.renderMode]),
    );

    expect(renderModes.get('')).toBe(RenderMode.Prerender);
    expect(renderModes.get('home')).toBe(RenderMode.Prerender);
  });
});
