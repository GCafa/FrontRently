import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {BodyRegister} from '../model/body-register';
import {AuthUrl} from '../url/auth.url';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) { }

  register(body: BodyRegister): Observable<boolean> {
    return this.http.post<{message: string}>(AuthUrl.register(), body).pipe(
      map(response => true),
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        return of(false);
      })
    )
  }
}
