import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModifyResponse } from '../model/user-modify-response';
import { User } from '../model/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/user';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  // AGGIORNATO: accetta FormData
  updateUser(formData: FormData): Observable<UserModifyResponse> {
    return this.http.post<UserModifyResponse>(`${this.apiUrl}/me/modify`, formData);
  }
}
