import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-overlay" *ngIf="loading">
      <div class="spinner-container">
        <div class="spinner-circle"></div>
        <div class="spinner-circle delay"></div>
        <div class="spinner-circle delay2"></div>
      </div>
      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
  styleUrls: ['./loading-spinner.css']
})
export class LoadingSpinner {
  @Input() loading: boolean = false;
  @Input() message: string = '';
}
