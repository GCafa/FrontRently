import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {AuthUrl} from '../url/auth.url';
import {BodyLogin} from '../model/body-login';
import {BodyPasswordReset} from '../model/body-password-reset';
import {BodyHouses} from '../model/body-houses';
import {UserRegistrationRequest} from '../model/user-registration-request';
import {UserLoginRequest} from '../model/user-login-request';
import {UserLoginResponse} from '../model/user-login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) { }
  register(user: UserRegistrationRequest, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('userRegistrationRequest', JSON.stringify(user));
    if (image) {
      formData.append('image', image);
    }

    return this.http.post<{message: string}>(AuthUrl.register(), formData).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        return of(false);
      })
    );
  }
  login(user: UserLoginRequest): Observable<any> {
    return this.http.post<UserLoginResponse>(AuthUrl.login(), user).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        return of(false);
      })
    );
  }
  passwordReset(body: BodyPasswordReset): Observable<boolean> {
    return this.http.post<{message: string}>(AuthUrl.passwordReset(), body).pipe(
      map(response => true),
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        return of(false);
      })
    );
  }
  houses(body: BodyHouses): Observable<boolean> {
    return this.http.post<{message: string}>(AuthUrl.houses(), body).pipe(
      map(response => true),
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        return of(false);
      })
    );
  }
  /**
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['login']);
  }


   * Verifica se esiste un token valido in localStorage

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  /**
   * Ottiene il token di autenticazione

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
*/
}
