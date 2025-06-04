import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User} from '../model/user';
import { CustomResponse } from '../model/custom-response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/v1/user'; // Sostituire con l'URL effettivo

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  enableUser(userId: number): Observable<CustomResponse> {
    return this.http.patch<CustomResponse>(`${this.apiUrl}/enable/${userId}`, {});
  }

  disableUser(userId: number): Observable<CustomResponse> {
    return this.http.patch<CustomResponse>(`${this.apiUrl}/disable/${userId}`, {});
  }

  acceptChangeRole(requestId: number): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/change-role/accept/${requestId}`, {});
  }

  rejectChangeRole(requestId: number, motivation: string): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/change-role/reject/${requestId}`, {motivation});
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }
}
