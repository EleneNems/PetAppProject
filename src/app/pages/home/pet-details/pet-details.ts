import { Component, OnInit  } from '@angular/core';
import { PetService } from '../../../services/pet.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingSpinner } from '../../../loading-spinner/loading-spinner';
@Component({
  selector: 'app-pet-details',
  imports: [CommonModule, RouterModule, LoadingSpinner],
  templateUrl: './pet-details.html',
  styleUrl: './pet-details.css',
})
export class PetDetails implements OnInit {

  pet: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private petService: PetService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.petService.getPetById(id).subscribe({
      next: pet => {
        this.pet = pet;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
