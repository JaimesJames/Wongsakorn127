import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellComponent } from './shell.component';
import { ShellLayoutService } from './shell-layout.service';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;
  let shellLayout: ShellLayoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    shellLayout = TestBed.inject(ShellLayoutService);
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

  it('does not render its own title badge when top-aligned (global title handles it)', () => {
    const badge = fixture.nativeElement.querySelector('app-credit-badge');
    expect(badge).toBeNull();
  });

  it('renders its own title badge with isLight passthrough when centered', () => {
    component.isLight = true;
    component.contentAlign = 'center';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('app-credit-badge h2');
    expect(badge.parentElement.classList).toContain('text-text-bglight');
  });

  it('sets the shell layout target when top-aligned', () => {
    component.isLight = true;
    component.titleOffsetPx = 160;
    component.ngOnChanges();
    expect(shellLayout.target()).toEqual({ topOffsetPx: 160, isLight: true, visible: true });
  });

  it('hides the shell layout target when centered', () => {
    component.contentAlign = 'center';
    component.ngOnChanges();
    expect(shellLayout.target().visible).toBeFalse();
  });
});
