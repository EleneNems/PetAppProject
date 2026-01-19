import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AdminStats } from '../models/admin-stats';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:8000/api/admin';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private authHeaders() {
    const token = this.auth.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getDashboardStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(
      `${this.apiUrl}/dashboard`,
      this.authHeaders()
    );
  }

  getPets(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/pets`,
      this.authHeaders()
    );
  }

  uploadPet(formData: FormData): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/pets`,
      formData,
      this.authHeaders()
    );
  }

  updatePet(id: number, formData: FormData): Observable<any> {
      formData.append('_method', 'PUT');
    return this.http.post(
          `${this.apiUrl}/pets/${id}`,
          formData,
          this.authHeaders()
      );
  }


  deletePet(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/pets/${id}`,
      this.authHeaders()
    );
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`, this.authHeaders());
  }

  switchUserRole(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/switch-role`, {}, this.authHeaders());
  }

  getEngagementReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/engagement-report`, this.authHeaders());
  }

}
