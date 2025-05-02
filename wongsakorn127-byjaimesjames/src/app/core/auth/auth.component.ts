import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { signInWithPopup } from 'firebase/auth';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { doc, setDoc } from 'firebase/firestore';

import { InitialLoadingComponent } from '../../share/components/loading/initialLoading.component';
import { CreditBadgeComponent } from '../../share/components/badges/creditBadge/creditBadge.component';
import { AuthService } from '../../adapters/angular/routers/auth/auth.service';


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
    private authService: AuthService,
  ) { }

  async ngOnInit(): Promise<void> {
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

  async register(){
    try {
      const user = await this.authService.registerWithWSKAccount(this.username ,this.email, this.password)
    } catch (error) {
      
    }
  }

  async login() {
    try {
      const user = await this.authService.loginWithWSKAccount(this.email, this.password)
      if(user){
        window.location.reload()
      }
    } catch (error) {
      
    }
  }

  async loginWithGoogle() {
    try {
      const user = await this.authService.loginWithGoogle()
      if(user){
        window.location.reload()
      }
    } catch (error) {

    }
  }
  // login() {
  //   signInWithEmailAndPassword(this.auth, this.email, this.password)
  //     .then((userCredential) => {

  //       const user = userCredential.user;
  //       console.log('Logged in as:', user.email);
  //       this.errorMessage = '';
  //       window.location.reload()
  //     })
  //     .catch((error) => {
  //       console.error('Login Error:', error);
  //       this.errorMessage = 'Login failed. Please check your credentials.';
  //     });
  // }
  // async loginWithGoogle() {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     const result = await signInWithPopup(this.auth, provider);
  //     const userDocRef = doc(this.firestore, `users/${result.user.uid}`);
  //     await setDoc(userDocRef, {
  //       uid: result.user.uid,
  //       email: result.user.email,
  //       username: result.user.displayName,
  //       createdAt: new Date(),
  //     });
  //     this.router.navigate(['/home']);
  //   } catch (error) {
  //     console.error('Google login error:', error);
  //   }
  // }
  // register() {
  //   createUserWithEmailAndPassword(this.auth, this.email, this.password)
  //     .then(async (userCredential) => {
  //       const user = userCredential.user;
  //       const userDocRef = doc(this.firestore, `users/${user.uid}`);
  //       await setDoc(userDocRef, {
  //         uid: user.uid,
  //         email: this.email,
  //         username: this.username,
  //         createdAt: new Date(),
  //       });
  //       this.errorMessage = 'Registration successed!♥';
  //     })
  //     .catch((error) => {

  //       console.error('Registration Error:', error);
  //       this.errorMessage = 'Registration failed. Please try again later.';
  //     });
  // }
}
