import { ShellLayoutService } from './shell-layout.service';

describe('ShellLayoutService', () => {
  let service: ShellLayoutService;

  beforeEach(() => {
    service = new ShellLayoutService();
  });

  it('starts hidden with a default offset', () => {
    expect(service.target()).toEqual({ topOffsetPx: 200, isLight: false, visible: false });
  });

  it('updates the target and marks it visible on setTarget', () => {
    service.setTarget(160, true);
    expect(service.target()).toEqual({ topOffsetPx: 160, isLight: true, visible: true });
  });

  it('marks the current target hidden without losing its offset on hide', () => {
    service.setTarget(160, true);
    service.hide();
    expect(service.target()).toEqual({ topOffsetPx: 160, isLight: true, visible: false });
  });
});
