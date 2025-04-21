import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User
} from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        let username = user.displayName;
        if (!username) {
          const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
          username = userDoc.exists() ? userDoc.data()['username'] : null;
        }
        this.usernameSubject.next(username);
      } else {
        this.usernameSubject.next(null);
      }
    });
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged(resolve)
    })
  }

}
