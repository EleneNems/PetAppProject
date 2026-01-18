import { Routes } from '@angular/router'
import { Login } from './pages/login/login'
import { MyPet } from './pages/my-pet/my-pet'
import { PetStats } from './pages/pet-stats/pet-stats'
import { Admin } from './pages/admin/admin'
import { AuthGuard } from './guard/auth.guard'
import { AdminGuard } from './guard/admin.guard'
import { Home } from './pages/home/home'
import { PetActivities } from './pages/pet-activities/pet-activities'
import { AddPetComponent } from './pages/admin/add-pet/add-pet'
export const routes: Routes = [
  { path: '', component: Home },

  { path: 'login', component: Login },

  { path: 'my-pet', component: MyPet, canActivate: [AuthGuard] },
  { path: 'pet-activities', component: PetActivities, canActivate: [AuthGuard] },
  { path: 'pet-stats', component: PetStats, canActivate: [AuthGuard] },

  { path: 'admin', component: Admin, canActivate: [AuthGuard, AdminGuard] },
  {path: 'admin/pets/add', component: AddPetComponent},
  
  { path: '**', redirectTo: '' }
]
