import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { InitialLoadingComponent } from '../../share/components/loading/initialLoading.component';
import { CreditBadgeComponent } from '../../share/components/badges/creditBadge/creditBadge.component';
import { AuthService } from '../../adapters/angular/routers/auth/auth.service';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InitialLoadingComponent, CreditBadgeComponent],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {

  isLoading: boolean = false

  isLogin: boolean = true

  registerForm: FormGroup;
  loginForm: FormGroup;
  Message: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },
      { validators: this.passwordMatchValidator }
    );

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true }
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true
    try {
      if (!isPlatformBrowser(this.platformId)) return;
      const user = await this.authService.getCurrentUser()
      if (user) {
        this.router.navigate(['/home']);
      }

    } catch (error) {

    }
    finally {
      this.isLoading = false
    }

  }

  async register() {
    try {
      if (this.registerForm.valid) {
        const { username, email, password } = this.registerForm.value;
        const user = await this.authService.registerWithWSKAccount(username, email, password)
        if (user) {
          window.location.reload()
        }
      }
    } catch (error) {
      this.Message = 'Registration failed. Please try again later.';
    }
  }

  async login() {
    try {
      if (this.loginForm.valid) {
        const email = this.registerForm.get('email')?.value;
        const password = this.registerForm.get('password')?.value;
        const user = await this.authService.loginWithWSKAccount(email, password)
        if (user) {
          window.location.reload()
        }
      }
    } catch (error) {
      this.Message = 'email or password wrong';
    }
  }

  async loginWithGoogle() {
    try {
      const user = await this.authService.loginWithGoogle()
      if (user) {
        window.location.reload()
      }
    } catch (error) {

    }
  }

  toggleMode() {
    this.isLogin = !this.isLogin
    this.Message = ''
  }
}
