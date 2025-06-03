import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const excludedUrls = ['/api/v1/auth/register', '/api/v1/auth/login'];
    const shouldExclude = excludedUrls.some(url => req.url.includes(url));

    if (shouldExclude) {
      return next.handle(req);
    }

    const token = localStorage.getItem('token');
    let clonedReq = req;
    if (token) {
      clonedReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
    }

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token scaduto o non valido
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
