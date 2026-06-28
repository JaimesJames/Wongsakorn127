import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SpinitgameComponent } from './spinitgame.component';

describe('SpinitgameComponent', () => {
  let component: SpinitgameComponent;

  const pointerEvent = (
    target: unknown,
    x: number,
    y: number,
    timeStamp: number
  ) => ({
    currentTarget: target,
    pointerId: 1,
    clientX: x,
    clientY: y,
    timeStamp,
    preventDefault: () => undefined
  } as unknown as PointerEvent);

  beforeEach(() => {
    localStorage.removeItem('spin-it-settings-v3');
    component = new SpinitgameComponent();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('uses Balanced as the default drama level', () => {
    expect(component.dramaLevel).toBe(3);
    expect(component.dramaLabel).toBe('Balanced');
  });

  it('opens and closes the settings panel without changing the selected settings tab', () => {
    component.openSettings();
    component.isColorMode = true;

    component.closeSettings();

    expect(component.isSettingsOpen).toBeFalse();
    expect(component.isColorMode).toBeTrue();
  });

  it('uses one trimmed non-empty name per line while preserving inner spaces', () => {
    component.namesText = '  Alice Smith  \n\n Bob  Dee \r\nCharlie ';

    expect(component.names).toEqual(['Alice Smith', 'Bob  Dee', 'Charlie']);
  });

  it('adds a person color to the wheel palette and updates the wheel', () => {
    component.namesText = 'Alice\nBob';
    component.onNamesChange();

    component.updatePersonColor(1, '#123456');

    expect(component.palette).toContain('#123456');
    expect(component.colorFor(1)).toBe('#123456');
    expect(component.wheelBackground).toContain('#123456');
  });

  it('does not change anyone else when a person gets a new color', () => {
    component.namesText = 'Alice\nBob\nCharlie';
    component.onNamesChange();
    const colorsBefore = [...component.personColors];

    component.updatePersonColor(1, '#123456');

    expect(component.personColors[0]).toBe(colorsBefore[0]);
    expect(component.personColors[1]).toBe('#123456');
    expect(component.personColors[2]).toBe(colorsBefore[2]);
    expect(component.palette.filter(color => color === '#123456').length).toBe(1);
  });

  it('keeps the color and lock on the same row when a person is renamed', () => {
    component.namesText = 'Alice\nBob\nCharlie';
    component.onNamesChange();
    component.updatePersonColor(1, '#123456');
    const colorsBefore = [...component.personColors];

    component.namesText = 'Alice\nBobby\nCharlie';
    component.onNamesChange();

    expect(component.personColors).toEqual(colorsBefore);
    expect(component.colorFor(1)).toBe('#123456');
    expect(component.lockedColors[1]).toBeTrue();
  });

  it('keeps colors attached to existing names when rows are reordered', () => {
    component.namesText = 'Alice\nBob\nCharlie';
    component.onNamesChange();
    component.updatePersonColor(0, '#111111');
    component.updatePersonColor(1, '#222222');

    component.namesText = 'Bob\nAlice\nCharlie';
    component.onNamesChange();

    expect(component.colorFor(0)).toBe('#222222');
    expect(component.colorFor(1)).toBe('#111111');
  });

  it('previews a person color live without adding it to the palette until confirmed', () => {
    component.namesText = 'Alice\nBob';
    component.onNamesChange();
    component.startPersonColorPreview(0);

    component.previewPersonColor(0, '#123456');

    expect(component.colorFor(0)).toBe('#123456');
    expect(component.wheelBackground).toContain('#123456');
    expect(component.palette).not.toContain('#123456');

    component.updatePersonColor(0, '#123456');
    expect(component.palette).toContain('#123456');
    expect(component.lockedColors[0]).toBeTrue();
  });

  it('does not auto-lock a person during color preview', () => {
    component.namesText = 'Alice\nBob';
    component.onNamesChange();

    component.previewPersonColor(0, '#123456');

    expect(component.lockedColors[0]).toBeFalse();
  });

  it('selects an existing palette color without adding a duplicate', () => {
    component.namesText = 'Alice\nBob';
    component.onNamesChange();
    const paletteSize = component.palette.length;
    const selectedColor = component.palette[2];

    component.selectPersonPaletteColor(0, selectedColor);

    expect(component.colorFor(0)).toBe(selectedColor);
    expect(component.palette.length).toBe(paletteSize);
  });

  it('restores the original person color when color selection is cancelled', () => {
    component.namesText = 'Alice\nBob';
    component.onNamesChange();
    const originalColor = component.colorFor(0);
    component.startPersonColorPreview(0);
    component.previewPersonColor(0, '#123456');

    component.cancelPersonColorPreview(0);

    expect(component.colorFor(0)).toBe(originalColor);
    expect(component.palette).not.toContain('#123456');
  });

  it('uses the monochrome text color with the higher contrast on Confirm', () => {
    component.pickerHexValue = '#FFFFFF';
    expect(component.confirmTextColor).toBe('#000000');

    component.pickerHexValue = '#000000';
    expect(component.confirmTextColor).toBe('#FFFFFF');
  });

  it('uses the monochrome text color with the higher contrast on wheel labels', () => {
    expect(component.textColorFor('#FFFFFF')).toBe('#000000');
    expect(component.textColorFor('#000000')).toBe('#FFFFFF');
  });

  it('keeps a locked person color when a palette color is added', () => {
    component.namesText = 'Alice\nBob';
    component.onNamesChange();
    component.updatePersonColor(0, '#123456');

    component.addPaletteColor('#000000');

    expect(component.colorFor(0)).toBe('#123456');
    expect(component.colorFor(1)).toBe(component.palette[1]);
  });

  it('randomizes only people using a removed palette color', () => {
    component.namesText = 'Alice\nBob\nCharlie';
    component.onNamesChange();
    const removedColor = component.colorFor(0);
    const untouchedColor = component.colorFor(1);
    spyOn(Math, 'random').and.returnValue(0);

    component.removePaletteColor(0);

    expect(component.palette).not.toContain(removedColor);
    expect(component.colorFor(0)).toBe(component.palette[0]);
    expect(component.colorFor(1)).toBe(untouchedColor);
  });

  it('reorders palette colors and reapplies their order only to unlocked people', () => {
    component.ngOnInit();
    component.updatePersonColor(0, '#123456');
    const lockedColor = component.colorFor(0);

    component.reorderPalette({ previousIndex: 0, currentIndex: 2 } as CdkDragDrop<string[]>);

    expect(component.palette).toEqual(['#7C3AED', '#A855F7', '#4C1D95', '#123456']);
    expect(component.colorFor(0)).toBe(lockedColor);
    expect(component.colorFor(1)).toBe('#A855F7');
    expect(component.colorFor(2)).toBe('#4C1D95');
  });

  it('lets the wheel be positioned slowly without counting it as a spin', () => {
    const wheel = {
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 200 }),
      setPointerCapture: () => undefined,
      hasPointerCapture: () => false
    };

    component.onWheelPointerDown(pointerEvent(wheel, 200, 100, 0));
    component.onWheelPointerMove(pointerEvent(wheel, 100, 200, 1000));
    component.onWheelPointerUp(pointerEvent(wheel, 100, 200, 1001));

    expect(component.rotation).toBe(90);
    expect(component.isSpinning).toBeFalse();
    expect(component.winner).toBe('');
  });

  it('turns a fast wheel flick into a spin and picks the name at the pointer', fakeAsync(() => {
    const wheel = {
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 200 }),
      setPointerCapture: () => undefined,
      hasPointerCapture: () => false
    };

    component.onWheelPointerDown(pointerEvent(wheel, 200, 100, 0));
    component.onWheelPointerMove(pointerEvent(wheel, 100, 200, 50));
    component.onWheelPointerUp(pointerEvent(wheel, 100, 200, 51));

    expect(component.isSpinning).toBeTrue();
    tick(8000);
    expect(component.isSpinning).toBeFalse();
    expect(component.names).toContain(component.winner);
  }));

  it('allows unlimited boosts while capping the wheel speed', () => {
    component.spin();
    for (let index = 0; index < 20; index++) component.spin();

    expect(component.isSpinning).toBeTrue();
    expect((component as any).spinVelocity).toBe(2160);
    component.ngOnDestroy();
  });

  it('makes each boost increase the current speed while the wheel is spinning', fakeAsync(() => {
    component.spin();
    tick(250);
    const speedBeforeBoost = Math.abs((component as any).spinVelocity);

    component.spin();

    expect(Math.abs((component as any).spinVelocity)).toBeGreaterThan(speedBeforeBoost);
    component.ngOnDestroy();
  }));

  it('offers five drama levels that progressively reduce the final resistance', () => {
    const resistances = [1, 2, 3, 4, 5].map(level => {
      component.dramaLevel = level;
      return (component as any).lowSpeedResistance(60);
    });

    expect(resistances).toEqual([168, 106, 54, 20, 6.2]);
  });

  it('slows down from maximum speed without making the player wait too long', fakeAsync(() => {
    component.dramaLevel = 4;
    for (let index = 0; index < 20; index++) component.spin();

    tick(3500);
    expect(component.isSpinning).toBeTrue();
    expect(Math.abs((component as any).spinVelocity)).toBeLessThan(90);

    tick(5000);

    expect(component.isSpinning).toBeFalse();
    expect(component.names).toContain(component.winner);
  }));

  it('renders names, assigned colors, and lock controls in color mode', () => {
    localStorage.removeItem('spin-it-settings-v3');
    TestBed.configureTestingModule({ imports: [SpinitgameComponent] });
    const fixture: ComponentFixture<SpinitgameComponent> = TestBed.createComponent(SpinitgameComponent);
    fixture.componentInstance.ngOnInit();
    fixture.componentInstance.openSettings();
    fixture.componentInstance.toggleColorMode();
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const renderedNames = Array.from(element.querySelectorAll('.name-text')).map(item => item.textContent?.trim());
    const personColorButtons = element.querySelectorAll('.person-color-button');

    expect(renderedNames).toEqual(['var1', 'var2', 'var3']);
    expect(personColorButtons.length).toBe(3);
    expect(element.querySelectorAll('.lock-button').length).toBe(3);

    (personColorButtons[0] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(document.querySelector('color-picker')).toBeTruthy();
    expect(document.querySelector('[aria-label="Hex color"]')).toBeTruthy();
    expect(document.querySelector('[aria-label="Cancel color selection"]')).toBeTruthy();
    expect(document.querySelector('.spin-color-picker-shell')?.textContent).toContain('Confirm');
  });

  it('shows the name under the pointer after the wheel naturally stops', fakeAsync(() => {
    component.namesText = 'Alice\nBob';

    component.spin();
    expect(component.isSpinning).toBeTrue();

    tick(7000);
    expect(component.names).toContain(component.winner);
    expect(component.isSpinning).toBeFalse();
  }));

  it('waits three seconds after a real spin before returning to idle spin', fakeAsync(() => {
    component.ngOnInit();
    component.spin();

    while (component.isSpinning) tick(100);
    const stoppedRotation = component.rotation;

    tick(2900);
    expect(component.rotation).toBe(stoppedRotation);

    tick(300);
    expect(component.rotation).toBeGreaterThan(stoppedRotation);
    component.ngOnDestroy();
  }));

  it('renders the winner in a modal dialog', () => {
    TestBed.configureTestingModule({ imports: [SpinitgameComponent] });
    const fixture: ComponentFixture<SpinitgameComponent> = TestBed.createComponent(SpinitgameComponent);
    fixture.componentInstance.winner = 'Alice';
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('.winner-modal') as HTMLElement;
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.textContent).toContain('Alice');
    expect(fixture.nativeElement.querySelector('.winner-modal-backdrop')).toBeTruthy();
  });

  it('removes the winning name only after the winner modal is closed', fakeAsync(() => {
    component.namesText = 'Alice\nBob\nCharlie';
    component.removeWinnerAfterSpin = true;

    component.spin();
    while (component.isSpinning) tick(100);

    expect(['Alice', 'Bob', 'Charlie']).toContain(component.winner);
    expect(component.names).toContain(component.winner);
    const winner = component.winner;

    component.closeWinnerModal();

    expect(component.winner).toBe('');
    expect(component.names).not.toContain(winner);
    expect(component.names.length).toBe(2);
  }));
});
