import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email = '';
  password = '';
  managerCode = '';
  error = '';

  private correctManagerCode = environment.managerSecretCode; // Change this to your desired secret code

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestore: Firestore
  ) {}

  async login() {
    this.error = '';
    try {
      const cred = await this.authService.loginWithEmail(this.email, this.password);

      const role = (this.managerCode === this.correctManagerCode) ? 'manager' : 'user';

      // Save role to Firestore under users collection
      const userDoc = doc(this.firestore, `users/${cred.user.uid}`);
      await setDoc(userDoc, { role }, { merge: true });

      this.router.navigate(['/resource-form']);
    } catch (err: any) {
      this.error = err.message;
    }
  }

  loginWithGoogle() {
    this.error = '';
    this.authService.loginWithGoogle()
      .then(async (cred) => {
        const role = (this.managerCode === this.correctManagerCode) ? 'manager' : 'user';

        const userDoc = doc(this.firestore, `users/${cred.user.uid}`);
        await setDoc(userDoc, { role }, { merge: true });

        this.router.navigate(['/resource-form']);
      })
      .catch(err => this.error = err.message);
  }
}
