import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgClass,
    RouterModule
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    // Prendi valore inserito
    const usernameOrEmail = this.loginForm.value.usernameOrEmail;
    const password = this.loginForm.value.password;

    // Passa sempre il campo come "username", sia che sia email sia che sia username
    const credentials = { username: usernameOrEmail, password: password };

    this.authService.login(credentials)
      .subscribe({
        next: (res) => {
          if (res && res.jwt) {
            localStorage.setItem('token', res.jwt);
            this.router.navigate(['/personal-area']);
          } else {
            this.errorMessage = 'Errore nella risposta del server';
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Credenziali non valide';
        }
      });
  }

}
