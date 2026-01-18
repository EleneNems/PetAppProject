import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { LoginCredentials } from '../models/login-credential';
import { RegisterData } from '../models/register-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api';

  private currentUserSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginCredentials): Observable<User> {
    return this.http
      .post<{ user: User; token: string }>(
        `${this.apiUrl}/login`,
        credentials,
        { headers: { 'Content-Type': 'application/json' } }
      )
      .pipe(
        tap(res => this.setSession(res)),
        map(res => res.user)
      );
  }

  register(data: RegisterData): Observable<User> {
    return this.http
      .post<{ user: User; token: string }>(
        `${this.apiUrl}/register`,
        data,
        { headers: { 'Content-Type': 'application/json' } }
      )
      .pipe(
        tap(res => this.setSession(res)),
        map(res => res.user)
      );
  }

  logout(): void {
    this.http
      .post(`${this.apiUrl}/logout`, {}, this.authHeaders())
      .subscribe(() => this.clearSession());
  }

  private setSession(res: { user: User; token: string }): void {
    localStorage.setItem('currentUser', JSON.stringify(res.user));
    localStorage.setItem('token', res.token);
    this.currentUserSubject.next(res.user);
  }

  private clearSession(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private authHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  updateCoins(coins: number): void {
    const user = this.currentUserSubject.value;
    if (!user) return;

    const updatedUser = { ...user, coins };

    this.currentUserSubject.next(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }

}
