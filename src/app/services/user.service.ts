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
    return this.http.get<User>(`${this.apiUrl}/me`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUser(formData: FormData): Observable<UserModifyResponse> {
    return this.http.post<UserModifyResponse>(`${this.apiUrl}/modify`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  changePassword(passwordData: BodyChangePassword): Observable<any> {
    const requestBody = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      repeatNewPassword: passwordData.repeatNewPassword // Aggiungiamo automaticamente repeatPassword
    };

    return this.http.post(`${this.apiUrl}/change-password`, requestBody, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
