import { Subject } from 'rxjs';
import { NavigatorComponent } from './navigator.component';

describe('NavigatorComponent', () => {
  it('should create', () => {
    const component = createComponent();

    expect(component).toBeTruthy();
  });

  it('toggles between visible and pre-hidden navigation states', () => {
    const component = createComponent();

    component.status = 'show';
    component.setNavStatus();
    expect(component.status).toBe('pre-hide');

    component.setNavStatus();
    expect(component.status).toBe('show');
  });
});

function createComponent(): NavigatorComponent {
  const router = {
    events: new Subject(),
  };
  const route = {
    queryParams: new Subject(),
  };

  return new NavigatorComponent(router as never, route as never);
}
