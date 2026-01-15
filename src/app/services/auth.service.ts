import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // Change to your Laravel API URL
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginCredentials): Observable<User> {
  if (
    credentials.email !== 'admin@pet.com' &&
    credentials.email !== 'user@pet.com'
  ) {
    return new Observable(observer => {
      observer.error('Invalid credentials')
    })
  }

  if (credentials.password.length < 6) {
    return new Observable(observer => {
      observer.error('Invalid credentials')
    })
  }

  const user: User = {
    id: 1,
    username: credentials.email === 'admin@pet.com' ? 'Admin' : 'User',
    email: credentials.email,
    role: credentials.email === 'admin@pet.com' ? 'admin' : 'user',
    token: 'mock-jwt-' + Date.now()
  }

  return of(user).pipe(
    tap(u => {
      localStorage.setItem('currentUser', JSON.stringify(u))
      this.currentUserSubject.next(u)
    })
  )
    // Real API implementation
    /*
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        const user: User = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          role: response.user.role,
          token: response.token
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
    */
  }

  register(data: RegisterData): Observable<User> {
  const user: User = {
    id: Math.floor(Math.random() * 1000),
    username: data.username,
    email: data.email,
    role: 'user',
    token: 'mock-jwt-' + Date.now()
  }

  return of(user).pipe(
    tap(u => {
      localStorage.setItem('currentUser', JSON.stringify(u))
      this.currentUserSubject.next(u)
    })
  )


    // Real API implementation
    /*
    return this.http.post<any>(`${this.apiUrl}/register`, data).pipe(
      map(response => {
        const user: User = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          role: response.user.role,
          token: response.token
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(error => {
        console.error('Register error:', error);
        throw error;
      })
    );
    */
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  getToken(): string | null {
    return this.currentUserValue?.token || null;
  }
}