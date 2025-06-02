import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UserLoginRequest } from '../../model/user-login-request';

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
  showPassword = false;
  errorMessage = '';
  submitted = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initForm();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const credentials: UserLoginRequest = {
      username: this.loginForm.value.usernameOrEmail,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        console.log('Risposta login:', res); // Debug

        if (res?.jwt) {
          const payload = this.parseJwt(res.jwt);
          console.log('Payload JWT:', payload); // Debug
          console.log('Ruolo trovato:', payload?.role); // Debug

          if (payload?.role) {
            // Salva esplicitamente il ruolo
            localStorage.setItem('userRole', payload.role);
            console.log('Ruolo salvato:', localStorage.getItem('userRole')); // Debug

            this.navigateByRole(payload.role);
          } else {
            this.errorMessage = 'Ruolo utente non trovato nel token';
            console.error('Payload senza ruolo:', payload);
          }
        } else {
          this.errorMessage = 'Token non valido nella risposta';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore login:', err);
        this.errorMessage = err.error?.message || 'Credenziali non valide';
        this.loading = false;
      }
    });
  }

  private navigateByRole(role: string): void {
    console.log('Navigazione per ruolo:', role); // Debug

    const routes: { [key: string]: string } = {
      'ADMIN': '/admin',           // Corretto i percorsi
      'MODERATOR': '/personal-area',
      'HOST': '/personal-area',
      'CLIENT': '/user-home'
    };

    const route = routes[role];
    console.log('Route selezionata:', route); // Debug

    if (route) {
      const finalUrl = `${window.location.origin}${route}`;
      console.log('Reindirizzamento a:', finalUrl); // Debug
      window.location.href = finalUrl;
    } else {
      console.error('Ruolo non riconosciuto:', role);
      this.router.navigate(['/home']);
    }
  }

  private parseJwt(token: string): any {
    if (!token) {
      console.error('Token vuoto');
      return null;
    }

    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        console.error('Token malformato');
        return null;
      }

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));

      const payload = JSON.parse(jsonPayload);
      console.log('JWT decodificato:', payload); // Debug
      return payload;
    } catch (e) {
      console.error('Errore nel parsing del JWT:', e);
      return null;
    }
  }
}
