import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthUrl } from '../url/auth.url';
import { UserLoginResponse } from '../model/user-login-response';
import { UserPasswordChangeRequest } from '../model/user-password-change-request';
import { UserRegistrationRequest } from '../model/user-registration-request';
import { UserLoginRequest } from '../model/user-login-request';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(user: UserRegistrationRequest, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('userRegistrationRequest', JSON.stringify(user));
    if (image) {
      formData.append('image', image);
    }

    return this.http.post<{message: string}>(AuthUrl.register(), formData).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Errore registrazione:', err);
        return throwError(() => err);
      })
    );
  }

  login(credentials: UserLoginRequest): Observable<UserLoginResponse> {
    return this.http.post<any>(AuthUrl.login(), credentials)
      .pipe(
        tap(response => {
          if (!response?.jwt) {
            throw new Error('Token JWT mancante nella risposta');
          }

          // Salva il token
          localStorage.setItem('token', response.jwt);

          // Estrai le info utente dal JWT
          const payload = this.parseJwt(response.jwt);
          if (!payload?.role) {
            throw new Error('Ruolo mancante nel token JWT');
          }

          // Salva il ruolo
          localStorage.setItem('userRole', payload.role);

          // Costruisci l'oggetto user dai dati del JWT
          response.user = {
            isActive: true,
            role: payload.role
          };
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Errore login:', error);
          throw error;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.router.navigate(['/home']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Errore parsing JWT:', e);
      return null;
    }
  }

  passwordReset(body: UserPasswordChangeRequest): Observable<boolean> {
    return this.http.post<{message: string}>(AuthUrl.passwordReset(), body).pipe(
      map(response => true),
      catchError((err: HttpErrorResponse) => {
        console.error('Errore reset password:', err);
        return of(false);
      })
    );
  }
}
