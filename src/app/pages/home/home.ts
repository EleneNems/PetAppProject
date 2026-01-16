import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { PetService } from '../../services/pet.service'
import { Pet } from '../../models/pet.model'
import { AuthService } from '../../services/auth.service'
import { LoadingSpinner } from '../../loading-spinner/loading-spinner'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoadingSpinner],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  pets: Pet[] = []
  loading = false
  showConfirm = false
  selectedPet: Pet | null = null
  successMessage = ''

  constructor(
    private petService: PetService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAvailablePets()
  }

  loadAvailablePets() {
    this.loading = true
    this.petService.getAvailablePets().subscribe({
      next: pets => {
        this.pets = pets
        this.loading = false
      },
      error: () => {
        this.loading = false
      }
    })
  }

  confirmAdopt(pet: Pet) {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/' } })
      return
    }

    this.selectedPet = pet
    this.showConfirm = true
  }

  adoptPet() {
    if (!this.selectedPet) return

    this.petService.adoptPet(this.selectedPet.id).subscribe({
      next: () => {
        this.successMessage = `✨ ${this.selectedPet?.name} has joined your family!`
        this.showConfirm = false
        this.selectedPet = null

        setTimeout(() => {
          this.router.navigate(['/my-pet'])
        }, 1200)
      },
      error: () => {
        this.showConfirm = false
        this.selectedPet = null
      }
    })
  }

  cancelAdopt() {
    this.showConfirm = false
    this.selectedPet = null
  }
}
