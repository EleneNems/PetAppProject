import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Pet } from '../models/pet.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private authHeaders(): { headers: HttpHeaders } {
    const token = this.auth.getToken();

    if (!token) {
      return { headers: new HttpHeaders() };
    }

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getAvailablePets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/pets`);
  }

  getMyPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/my-pets`, this.authHeaders());
  }

  adoptPet(petId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/pets/${petId}/adopt`,
      {},
      this.authHeaders()
    );
  }

  getMyPet(): Observable<{ pets: any[]; coins: number }> {
    return this.http.get<{ pets: any[]; coins: number }>(
    `${this.apiUrl}/my-pet`,
      this.authHeaders()
    );
  }

  feedPet(id: number) {
    return this.http
      .post<any>(`${this.apiUrl}/pets/${id}/feed`, {}, this.authHeaders())
      .pipe(
        tap(res => this.auth.updateCoins(res.coins))
      );
  }

  playPet(id: number) {
    return this.http
      .post<any>(`${this.apiUrl}/pets/${id}/play`, {}, this.authHeaders())
      .pipe(
        tap(res => this.auth.updateCoins(res.coins))
      );
  }

  restPet(id: number) {
    return this.http
      .post<any>(`${this.apiUrl}/pets/${id}/rest`, {}, this.authHeaders())
      .pipe(
        tap(res => this.auth.updateCoins(res.coins))
      );
  }
}
