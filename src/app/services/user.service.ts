import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomResponse } from '../model/custom-response';
import { User } from '../model/user';
import { UserPasswordChangeRequest } from '../model/user-password-change-request';
import { ChangeRoleRequest } from '../model/change-role-request';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/user';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUser(formData: FormData): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/modify`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  changePassword(passwordData: UserPasswordChangeRequest): Observable<any> {
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

  rechargeBalance(amount: number): Observable<any> {
    let requestParams = new HttpParams()
      .set('username', this.getUsername() || '')
      .set('amount', amount.toString());

    return this.http.post(`${this.apiUrl}/recharge-balance`, null, {
      headers: this.getAuthHeaders(),
      params: requestParams
    });
  }



  private decodeJWT(): any {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return null;

    const payload = token.split('.')[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');

    try {
      const decodedPayload = atob(padded);
      return JSON.parse(decodedPayload);
    } catch (e) {
      return null;
    }
  }

  getUsername(): string | null {
    const decoded = this.decodeJWT();
    return decoded?.sub || null;
  }

  getRoleFromJWT(): string | null {
    const decoded = this.decodeJWT();
    return decoded?.role || (Array.isArray(decoded?.roles) ? decoded.roles[0] : null);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}
