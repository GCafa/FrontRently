import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModifyResponse } from '../model/user-modify-response';
import { User } from '../model/user';
import { BodyChangePassword } from '../model/body-change-password';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/user';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  updateUser(formData: FormData): Observable<UserModifyResponse> {
    return this.http.post<UserModifyResponse>(`${this.apiUrl}/me/modify`, formData);
  }

  changePassword(passwordData: BodyChangePassword): Observable<any> {
    return this.http.post(`${this.apiUrl}/me/change-password`, passwordData, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
