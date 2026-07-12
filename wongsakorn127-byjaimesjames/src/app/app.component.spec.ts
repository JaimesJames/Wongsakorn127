import { AppComponent } from './app.component';
import { ShellLayoutService } from './core/layout/shell/shell-layout.service';

describe('AppComponent', () => {
  it('should create the app', () => {
    const app = new AppComponent(new ShellLayoutService());

    expect(app).toBeTruthy();
  });

  it(`should have the 'wongsakorn127-byjaimesjames' title`, () => {
    const app = new AppComponent(new ShellLayoutService());

    expect(app.title).toEqual('wongsakorn127-byjaimesjames');
  });

  it('exposes the shell layout target signal', () => {
    const shellLayout = new ShellLayoutService();
    const app = new AppComponent(shellLayout);

    shellLayout.setTarget(160, true);

    expect(app.shellTarget()).toEqual({ topOffsetPx: 160, isLight: true, visible: true });
  });
});
