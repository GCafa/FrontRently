import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModifyRequest } from '../model/user-modify-request';
import { UserModifyResponse } from '../model/user-modify-response';
import { User } from '../model/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/user';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  updateUser(request: UserModifyRequest): Observable<UserModifyResponse> {
    return this.http.put<UserModifyResponse>(`${this.apiUrl}/me`, request);
  }
}
