import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { signInWithPopup } from 'firebase/auth';
import { Router } from '@angular/router';
import { Firestore, getDoc } from '@angular/fire/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { AuthService } from '../../share/services/auth/auth.service';
import { InitialLoadingComponent } from '../../share/components/loading/initialLoading.component';
import { CreditBadgeComponent } from '../../share/components/badges/creditBadge/creditBadge.component';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, InitialLoadingComponent, CreditBadgeComponent],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {

  isLoading: boolean = false

  isLogin: boolean = true

  username: string = ''
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.handleRedirectResult()
    this.isLoading = true
    try {
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

  login() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {

        const user = userCredential.user;
        console.log('Logged in as:', user.email);
        this.errorMessage = '';
        window.location.reload()
      })
      .catch((error) => {
        console.error('Login Error:', error);
        this.errorMessage = 'Login failed. Please check your credentials.';
      });
  }

  register() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        await setDoc(userDocRef, {
          uid: user.uid,
          email: this.email,
          username: this.username,
          createdAt: new Date(),
        });
        this.errorMessage = 'Registration successed!♥';
      })
      .catch((error) => {

        console.error('Registration Error:', error);
        this.errorMessage = 'Registration failed. Please try again later.';
      });
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(this.auth, provider);
    } catch (error) {
      console.error('Google login error:', error);
    }
  }

  async handleRedirectResult() {
    try {
      const result = await getRedirectResult(this.auth);
      if (result && result.user) {
        const user = result.user;
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
  
        // เช็คก่อนว่ามี doc อยู่รึยัง
        const existing = await getDoc(userDocRef);
        if (!existing.exists()) {
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            username: user.displayName,
            createdAt: new Date(),
          });
        }
  
        this.router.navigate(['/home']); 
      } 
    } catch (err) {
      console.error('Google login redirect error:', err);
    }
  }
}
