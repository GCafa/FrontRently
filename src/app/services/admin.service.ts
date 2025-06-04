import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { CustomResponse } from '../model/custom-response';
import {ChangeRoleRequest} from '../model/change-role-request';
import { ChangeRoleResponse } from '../model/change-role-response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8080/api/v1';
  private adminUrl = `${this.baseUrl}/admin`;
  private userUrl = `${this.baseUrl}/user`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.userUrl}`);
  }

  getAllChangeRoleRequests(): Observable<ChangeRoleResponse[]> {
    return this.http.get<ChangeRoleResponse[]>(`${this.adminUrl}/change-role/requests`);
  }

  enableUser(userId: number): Observable<CustomResponse> {
    return this.http.patch<CustomResponse>(`${this.userUrl}/enable/${userId}`, {});
  }

  disableUser(userId: number): Observable<CustomResponse> {
    return this.http.patch<CustomResponse>(`${this.userUrl}/disable/${userId}`, {});
  }

  acceptChangeRole(requestId: number): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.adminUrl}/change-role/accept/${requestId}`, {});
  }

  rejectChangeRole(requestId: number, motivation: string): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.adminUrl}/change-role/reject/${requestId}`, {motivation});
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }
}
