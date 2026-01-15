import { Component, OnDestroy } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { CommonModule } from '@angular/common'
import { AuthService } from '../services/auth.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnDestroy {
  isMenuOpen = false
  isLoggedIn = false

  private authSub!: Subscription

  constructor(private authService: AuthService) {
    this.authSub = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user
    })
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  closeMenu() {
    this.isMenuOpen = false
  }

  ngOnDestroy() {
    this.authSub.unsubscribe()
  }
}
