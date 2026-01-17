import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetService } from '../../services/pet.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoadingSpinner } from '../../loading-spinner/loading-spinner';

@Component({
  selector: 'app-my-pet',
  standalone: true,
  imports: [CommonModule, LoadingSpinner],
  templateUrl: './my-pet.html',
  styleUrls: ['./my-pet.css']
})
export class MyPet implements OnInit {

  pets: any[] = [];
  coins = 0;
  loading = false;

  readonly ACTION_COST = 5;

  constructor(
    private petService: PetService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/my-pet' } });
      return;
    }

    this.loadMyPet();
  }

  loadMyPet(): void {
    this.loading = true;

    this.petService.getMyPet().subscribe({
      next: (res) => {
        this.pets = res.pets;
        this.coins = res.coins;
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load pets', err);
        this.loading = false;
      }
    });
  }

  canPerform(statValue: number): boolean {
    return statValue < 100 && this.coins >= this.ACTION_COST;
  }

  feed(pet: any): void {
    this.petService.feedPet(pet.id).subscribe(() => this.loadMyPet());
  }

  play(pet: any): void {
    this.petService.playPet(pet.id).subscribe(() => this.loadMyPet());
  }

  rest(pet: any): void {
    this.petService.restPet(pet.id).subscribe(() => this.loadMyPet());
  }
}
