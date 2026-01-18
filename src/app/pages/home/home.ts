import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PetService } from '../../services/pet.service'
import { Pet } from '../../models/pet.model'
import { AuthService } from '../../services/auth.service'
import { LoadingSpinner } from '../../loading-spinner/loading-spinner'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinner],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  pets: Pet[] = []
  filteredPets: Pet[] = []

  loading = false
  showConfirm = false
  selectedPet: Pet | null = null
  successMessage = ''

  // 🔍 FILTER STATE
  searchTerm = ''
  selectedSpecies = ''
  sortOrder: 'az' | 'za' = 'az'
  speciesList: string[] = []

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
        this.filteredPets = pets
        this.extractSpecies()
        this.applyFilters()
        this.loading = false
      },
      error: () => {
        this.loading = false
      }
    })
  }

  extractSpecies() {
    this.speciesList = Array.from(
      new Set(this.pets.map(p => p.species))
    ).sort()
  }

  applyFilters() {
    let result = [...this.pets]

    if (this.searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    }

    if (this.selectedSpecies) {
      result = result.filter(p => p.species === this.selectedSpecies)
    }

    result.sort((a, b) =>
      this.sortOrder === 'az'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )

    this.filteredPets = result
  }

  confirmAdopt(pet: Pet) {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/' }
      })
      return
    }

    this.selectedPet = pet
    this.showConfirm = true
  }

  adoptPet() {
    if (!this.selectedPet) return
    const adoptedPet = this.selectedPet
    this.petService.adoptPet(adoptedPet.id).    subscribe({
      next: () => {
        this.successMessage = ` ${adoptedPet.name} has joined your family!`
        this.showConfirm = false
        this.selectedPet = null
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
