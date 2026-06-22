import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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

  it('keeps a locked person color when a palette color is added', () => {
    component.namesText = 'Alice\nBob';
    component.onNamesChange();
    component.updatePersonColor(0, '#123456');
    component.toggleColorLock(0);

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

  it('renders names, assigned colors, and lock controls in color mode', () => {
    localStorage.removeItem('spin-it-settings-v3');
    TestBed.configureTestingModule({ imports: [SpinitgameComponent] });
    const fixture: ComponentFixture<SpinitgameComponent> = TestBed.createComponent(SpinitgameComponent);
    fixture.componentInstance.ngOnInit();
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
