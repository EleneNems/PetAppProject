import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-pet-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-stats.html',
  styleUrl: './pet-stats.css'
})
export class PetStats implements OnInit {

  stats = {
    health: 0,
    happiness: 0,
    energy: 0,
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    achievements: [] as any[]
  };

  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:8000/api/pet-stats', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    }).subscribe({
      next: data => {
        this.stats = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  levelProgress(): number {
    return Math.min(100, (this.stats.xp % 100));
  }

  statMessage(value: number, type: string): string {
    if (value >= 90) return `Your pet is thriving 💖`;
    if (value >= 60) return `Doing well, keep it up`;
    return `Needs attention!`;
  }
}
