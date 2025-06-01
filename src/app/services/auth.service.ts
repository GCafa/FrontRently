import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthUrl } from '../url/auth.url';
import { BodyLogin } from '../model/body-login';
import { BodyChangePassword } from '../model/body-change-password';
import { BodyHouses } from '../model/body-houses';
import { UserRegistrationRequest } from '../model/user-registration-request';
import { UserLoginRequest } from '../model/user-login-request';
import { UserLoginResponse } from '../model/user-login-response';
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
        return of(false);
      })
    );
  }

  login(credentials: UserLoginRequest): Observable<UserLoginResponse> {
    return this.http.post<UserLoginResponse>(AuthUrl.login(), credentials)
      .pipe(
        tap(response => {
          if (response.jwt) {
            localStorage.setItem('token', response.jwt);
            const payload = this.parseJwt(response.jwt);
            if (payload?.role) {
              localStorage.setItem('userRole', payload.role);
            }
          }
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
    this.router.navigate(['/login']);
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

  passwordReset(body: BodyChangePassword): Observable<boolean> {
    return this.http.post<{message: string}>(AuthUrl.passwordReset(), body).pipe(
      map(response => true),
      catchError((err: HttpErrorResponse) => {
        console.error('Errore reset password:', err);
        return of(false);
      })
    );
  }

  houses(body: BodyHouses): Observable<boolean> {
    return this.http.post<{message: string}>(AuthUrl.houses(), body).pipe(
      map(response => true),
      catchError((err: HttpErrorResponse) => {
        console.error('Errore houses:', err);
        return of(false);
      })
    );
  }
}
