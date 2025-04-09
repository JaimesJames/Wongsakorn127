import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  // Firebase Auth service
  auth = inject(Auth);

  constructor() {}

  // Login function
  login() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        // Successfully logged in
        const user = userCredential.user;
        console.log('Logged in as:', user.email);
        this.errorMessage = '';  // Reset error message
      })
      .catch((error) => {
        // Handle login error
        console.error('Login Error:', error);
        this.errorMessage = 'Login failed. Please check your credentials.';
      });
  }

  // Register function
  register() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        // Successfully registered
        const user = userCredential.user;
        console.log('Registered as:', user.email);
        this.errorMessage = '';  // Reset error message
      })
      .catch((error) => {
        // Handle registration error
        console.error('Registration Error:', error);
        this.errorMessage = 'Registration failed. Please try again later.';
      });
  }
}
