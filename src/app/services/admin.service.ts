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
  
  uploadPet(formData: FormData): Observable<any>   {
    return this.http.post(`${this.apiUrl}/pets`,  formData, this.authHeaders());
  }

}
