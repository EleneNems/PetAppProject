import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetService } from '../../services/pet.service';

@Component({
  selector: 'app-pet-activities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-activities.html',
  styleUrls: ['./pet-activities.css'],
})
export class PetActivities {
  isWorking = false;
  currentActivity: string | null = null;

  constructor(private petService: PetService) {}
  
  doActivity(type: string) {
    if (this.isWorking) return;

    this.isWorking = true;
    this.currentActivity = type;

    setTimeout(() => {
      this.petService.completeActivity(type).subscribe({
        complete: () => {
          this.isWorking = false;
          this.currentActivity = null;
        }
      });
    }, 5000); 
  }

  getActivityImage(): string {
    switch (this.currentActivity) {
      case 'clean': return 'activities/cleaning.png';
      case 'groom': return 'activities/grooming.png';
      case 'train': return 'activities/training.png';
      default: return 'activities/cleaning.png';
    }
  }

}
