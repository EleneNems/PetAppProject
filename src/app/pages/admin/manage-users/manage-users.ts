import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';
import { LoadingSpinner } from '../../../loading-spinner/loading-spinner';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, LoadingSpinner],
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.css']
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  message = '';
  loading = false;

  showModal = false;
  modalUser: any = null;

  currentUserId: number | null = null;

  constructor(private adminService: AdminService, private auth: AuthService) {}

  ngOnInit() {
    this.currentUserId = this.auth.currentUserValue?.id || null;
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: res => {
        this.users = res;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  confirmSwitchRole(user: any) {
    if (user.id === this.currentUserId) {
      this.message = "You cannot change your own role!";
      setTimeout(() => this.message = '', 3000);
      return;
    }

    this.modalUser = user;
    this.showModal = true;
  }

  cancelModal() {
    this.modalUser = null;
    this.showModal = false;
  }

  switchRole() {
    if (!this.modalUser) return;

    this.loading = true;
    this.adminService.switchUserRole(this.modalUser.id).subscribe({
      next: res => {
        this.modalUser.role = res.user.role;
        this.message = `${this.modalUser.name}'s role is now ${this.modalUser.role}`;
        this.cancelModal();
        this.loading = false;
        this.loadUsers();
        setTimeout(() => this.message = '', 3000);
      },
      error: err => {
        console.error(err);
        this.message = 'Failed to switch user role.';
        this.cancelModal();
        this.loading = false;
      }
    });
  }

  getAdminCount(): number {
    return this.users.filter(user => user.role === 'admin').length;
  }

  getTotalCoins(): number {
    return this.users.reduce((total, user) => total + (user.coins || 0), 0);
  }
}