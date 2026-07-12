import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('disables register submission until terms are accepted', () => {
    component.isLogin = false;
    component.registerForm.patchValue({
      username: 'tester',
      email: 'tester@example.com',
      password: 'secret1',
      confirmPassword: 'secret1'
    });
    expect(component.registerForm.valid).toBeFalse();

    component.registerForm.get('agreeToTerms')?.setValue(true);
    expect(component.registerForm.valid).toBeTrue();
  });

  it('gates the Google button only while registering without consent', () => {
    component.isLogin = true;
    expect(component.isGoogleButtonDisabled).toBeFalse();

    component.isLogin = false;
    component.registerForm.get('agreeToTerms')?.setValue(false);
    expect(component.isGoogleButtonDisabled).toBeTrue();

    component.registerForm.get('agreeToTerms')?.setValue(true);
    expect(component.isGoogleButtonDisabled).toBeFalse();
  });

  it('resets the consent checkbox when toggling modes', () => {
    component.registerForm.get('agreeToTerms')?.setValue(true);
    component.toggleMode();
    expect(component.registerForm.get('agreeToTerms')?.value).toBeFalse();
  });

  it('does not call the auth service when Google sign-in is gated', async () => {
    const authServiceSpy = spyOn((component as any).authService, 'loginWithGoogle');
    component.isLogin = false;
    component.registerForm.get('agreeToTerms')?.setValue(false);
    await component.loginWithGoogle();
    expect(authServiceSpy).not.toHaveBeenCalled();
  });
});
