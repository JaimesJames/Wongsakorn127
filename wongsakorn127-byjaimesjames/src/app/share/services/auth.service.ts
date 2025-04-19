import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  signOut,
  User
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);

  // user$: Observable<User | null> = authState(this.auth);

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged(resolve)
    })
  }
  // getCurrentUser(): Observable<User | null> {
  //   return this.user$;
  // }
}
