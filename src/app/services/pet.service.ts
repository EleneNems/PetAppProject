import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { Pet } from '../models/pet.model'

@Injectable({ providedIn: 'root' })
export class PetService {

  private availablePets: Pet[] = [
    {
      id: 1,
      name: 'Mochi',
      species: 'Sheep',
      image: 'pets/pet10.png',
      age: 0,
      health: 100,
      happiness: 100,
      hunger: 0
    },
    {
      id: 2,
      name: 'Luna',
      species: 'Cat',
      image: 'pets/pet6.png',
      age: 0,
      health: 100,
      happiness: 100,
      hunger: 0
    },
    {
      id: 3,
      name: 'Peach',
      species: 'cow',
      image: 'pets/pet4.png',
      age: 0,
      health: 100,
      happiness: 100,
      hunger: 0
    },
    {
      id: 4,
      name: 'Steve',
      species: 'Racoon',
      image: 'pets/pet7.png',
      age: 0,
      health: 100,
      happiness: 100,
      hunger: 0
    },
    {
      id: 5,
      name: 'Daisy',
      species: 'Cow',
      image: 'pets/pet8.png',
      age: 0,
      health: 100,
      happiness: 100,
      hunger: 0
    },
    {
      id: 6,
      name: 'Charlie',
      species: 'Ferret',
      image: 'pets/pet2.png',
      age: 0,
      health: 100,
      happiness: 100,
      hunger: 0
    },
    {
      id: 8,
      name: 'Minnie',
      species: 'Chipmunk',
      image: 'pets/pet3.png',
      age: 0,
      health: 100,
      happiness: 100,
      hunger: 0
    },
    {
      id: 9,
      name: 'Pebble',
      species: 'Rat',
      image: 'pets/pet5.png',
      age: 0,
      health: 100,
      happiness: 100,
      hunger: 0
    },
    {
      id: 10,
      name: 'Bean',
      species: 'Bear',
      image: 'pets/pet9.png',
      age: 0,
      health: 100,
      happiness: 100,
      hunger: 0
    }
  ]

  private userPets$ = new BehaviorSubject<Pet[]>([])

  getAvailablePets(): Observable<Pet[]> {
    return of(this.availablePets)
  }

  getMyPets(): Observable<Pet[]> {
    return this.userPets$.asObservable()
  }

  adoptPet(pet: Pet) {
    const adoptedPet = { ...pet, id: Date.now() }
    this.userPets$.next([...this.userPets$.value, adoptedPet])
  }
}
