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
  loading = false;

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
      next: (data: any[]) => {
        this.pets = data; 
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load pets', err);
        this.loading = false;
      }
    });
  }

  feed(pet: any): void {
    console.log('Feed clicked for', pet.name);
    // call backend later
  }

  play(pet: any): void {
    console.log('Play clicked for', pet.name);
    // call backend later
  }

  rest(pet: any): void {
    console.log('Rest clicked for', pet.name);
    // call backend later
  }
}
