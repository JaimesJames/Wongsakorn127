import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellComponent } from './shell.component';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defaults to top-aligned content', () => {
    const container = fixture.nativeElement.querySelector('div');
    expect(container.classList).toContain('justify-start');
    expect(container.classList).not.toContain('justify-center');
  });

  it('centers content when contentAlign is "center"', () => {
    component.contentAlign = 'center';
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('div');
    expect(container.classList).toContain('justify-center');
    expect(container.classList).not.toContain('justify-start');
  });

  it('passes isLight through to the credit badge', () => {
    component.isLight = true;
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('app-credit-badge h2');
    expect(badge.parentElement.classList).toContain('text-text-bglight');
  });
});
