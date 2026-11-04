import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, user, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$ = new BehaviorSubject<any | null>(null);
  role$ = new BehaviorSubject<string | null>(null);  // Store user role

  constructor(private auth: Auth, private firestore: Firestore) {
    user(this.auth).subscribe(u => {
      this.currentUser$.next(u);
      if (u) {
        this.loadUserRole(u.uid);
      } else {
        this.role$.next(null);
      }
    });
  }

  async loginWithEmail(email: string, password: string): Promise<UserCredential> {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    await this.loadUserRole(cred.user.uid);
    return cred;  // Ensure credentials are returned
  }

  async loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(this.auth, provider);
    
    // Optional: Auto-create Firestore doc if user logs in first time
    const userDoc = doc(this.firestore, `users/${cred.user.uid}`);
    const snap = await getDoc(userDoc);
    if (!snap.exists()) {
      await setDoc(userDoc, { role: 'user' });  // Default role for new users
    }

    await this.loadUserRole(cred.user.uid);
    return cred;  // Ensure credentials are returned
  }

  logout() {
    this.role$.next(null);
    return signOut(this.auth);
  }

  private async loadUserRole(uid: string) {
    const userDoc = doc(this.firestore, `users/${uid}`);
    const snap = await getDoc(userDoc);
    if (snap.exists()) {
      const role = (snap.data() as any).role;
      this.role$.next(role);
    } else {
      this.role$.next(null);
    }
  }
}
