import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { PetService } from '../../services/pet.service'
import { Pet } from '../../models/pet.model'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  pets: Pet[] = []

  constructor(
    private petService: PetService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.petService.getAvailablePets().subscribe(pets => {
      this.pets = pets
    })
  }

  adopt(pet: Pet) {
    if (!this.auth.currentUserValue) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/' }
      })
      return
    }

    this.petService.adoptPet(pet)
    this.router.navigate(['/my-pet'])
  }
}
