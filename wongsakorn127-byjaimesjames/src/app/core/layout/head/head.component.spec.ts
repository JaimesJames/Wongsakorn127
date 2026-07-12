import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadComponent } from './head.component';

describe('HeadComponent', () => {
  let component: HeadComponent;
  let fixture: ComponentFixture<HeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('falls back to the default profile image when the photo fails to load', () => {
    const img = document.createElement('img');
    img.src = 'https://lh3.googleusercontent.com/a/broken-photo';
    component.onProfileImageError({ target: img } as unknown as Event);
    expect(img.src.endsWith('profile-1.png')).toBeTrue();
  });

  it('does not loop when the default profile image itself errors', () => {
    const img = document.createElement('img');
    img.src = 'profile-1.png';
    component.onProfileImageError({ target: img } as unknown as Event);
    expect(img.src.endsWith('profile-1.png')).toBeTrue();
  });
});
