export interface Pet {
  id: number
  name: string
  species: string
  image: string

  age: number
  health: number
  happiness: number
  hunger: number

  ownerId?: number
}
