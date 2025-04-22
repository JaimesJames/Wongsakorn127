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
import { Info } from '../../models/share.model';
import { convertDocToInfo } from './auth.util';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private firestore: Firestore) {}

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged(resolve)
    })
  }

  async getInfo(): Promise<Info | null>{
    const user = await this.getCurrentUser()
    if(user){
      const ref = doc(this.firestore, `users/${user.uid}`)
      const snapshot =  await getDoc(ref)
      const identify = convertDocToInfo(snapshot)
      return {
        profileUrl:user.photoURL || null, 
        ...identify
        }
      
    }
    return null
  }

}
