import { Routes } from '@angular/router'
import { Login } from './pages/login/login'
import { MyPet } from './pages/my-pet/my-pet'
import { PetStore } from './pages/pet-store/pet-store'
import { PetStats } from './pages/pet-stats/pet-stats'
import { Admin } from './pages/admin/admin'
import { AuthGuard } from './guard/auth.guard'
import { AdminGuard } from './guard/admin.guard'
import { Home } from './pages/home/home'
export const routes: Routes = [
  { path: '', component: Home },

  { path: 'login', component: Login },

  { path: 'my-pet', component: MyPet, canActivate: [AuthGuard] },
  { path: 'pet-store', component: PetStore, canActivate: [AuthGuard] },
  { path: 'pet-stats', component: PetStats, canActivate: [AuthGuard] },

  { path: 'admin', component: Admin, canActivate: [AuthGuard, AdminGuard] },

  { path: '**', redirectTo: '' }
]
