import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModifyResponse } from '../model/user-modify-response';
import { User } from '../model/user';
import { BodyChangePassword } from '../model/body-change-password';
import {ChangeRoleRequest} from '../model/change-role-request';

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
      repeatNewPassword: passwordData.repeatNewPassword
    };

    return this.http.post(`${this.apiUrl}/change-password`, requestBody, {
      headers: this.getAuthHeaders()
    });
  }

  changeRoleRequest(request: ChangeRoleRequest): Observable<any> {
    return this.http.post(
      'http://localhost:8080/api/v1/client/change-role/request',
      request,
      { headers: this.getAuthHeaders() }
    );
  }


  /**
   * Estrae il ruolo dal token JWT salvato in localStorage o sessionStorage.
   * Restituisce una stringa come 'USER', 'HOST', 'ADMIN' oppure null se non trovato.
   */
  getRoleFromJWT(): string | null {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return null;

    const payload = token.split('.')[1];
    if (!payload) return null;
    // Decodifica base64url
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');

    try {
      const decodedPayload = atob(padded);
      const obj = JSON.parse(decodedPayload);
      return obj.role || (Array.isArray(obj.roles) ? obj.roles[0] : null) || null;
    } catch (e) {
      return null;
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
