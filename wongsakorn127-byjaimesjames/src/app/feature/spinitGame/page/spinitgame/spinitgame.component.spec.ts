import { fakeAsync, tick } from '@angular/core/testing';
import { SpinitgameComponent } from './spinitgame.component';

describe('SpinitgameComponent', () => {
  let component: SpinitgameComponent;

  beforeEach(() => {
    component = new SpinitgameComponent();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('uses one trimmed non-empty name per line while preserving inner spaces', () => {
    component.namesText = '  Alice Smith  \n\n Bob  Dee \r\nCharlie ';

    expect(component.names).toEqual(['Alice Smith', 'Bob  Dee', 'Charlie']);
  });

  it('shows the selected name after spinning', fakeAsync(() => {
    component.namesText = 'Alice\nBob';
    spyOn(Math, 'random').and.returnValue(0.75);

    component.spin();
    expect(component.isSpinning).toBeTrue();

    tick(4200);
    expect(component.winner).toBe('Bob');
    expect(component.isSpinning).toBeFalse();
  }));
});
