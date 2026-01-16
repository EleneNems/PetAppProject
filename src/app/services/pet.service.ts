import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet } from '../models/pet.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private authHeaders(): { headers: HttpHeaders } {
    const token = this.auth.getToken();
    if (!token) return { headers: new HttpHeaders() }; // no auth for public requests
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) };
  }

  getAvailablePets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/pets`);
  }

  getMyPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/my-pets`, this.authHeaders());
  }

  adoptPet(petId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/pets/${petId}/adopt`, {}, this.authHeaders());
  }

  getMyPet() {
    return this.http.get<any>(`${this.apiUrl}/my-pet`, this.authHeaders());
  }
}
