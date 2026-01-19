import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { AdminStats } from '../../models/admin-stats';
import { LoadingSpinner } from '../../loading-spinner/loading-spinner';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, LoadingSpinner, RouterModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class Admin implements OnInit {
  stats: AdminStats | null = null;
  loading = true;

  // New for engagement report
  reportLoading = false;
  engagementReport: any = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  generateReport(): void {
  this.reportLoading = true;

  this.adminService.getEngagementReport().subscribe({
    next: (data) => {
      this.reportLoading = false;

      // Create JSON blob
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      // Create invisible anchor and click
      const a = document.createElement('a');
      a.href = url;
      a.download = `engagement-report-${new Date().toISOString()}.json`;
      a.click();

      // Release memory
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error(err);
      this.reportLoading = false;
    }
  });
}

}
