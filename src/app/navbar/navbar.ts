import { Component, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnDestroy {

  isLoggedIn = false;
  coins = 0;

  private authSub: Subscription;

  constructor(private authService: AuthService) {
    this.authSub = this.authService.currentUser$.subscribe(
      (user: User | null) => {
        this.isLoggedIn = !!user;
        this.coins = user?.coins ?? 0;
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
