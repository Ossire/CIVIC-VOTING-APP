import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-error-page',
  imports: [CommonModule],
  templateUrl: './error-page.html',
  styleUrl: './error-page.css',
})
export class ErrorPageComponent {
  private authService = inject(AuthService);
  private location = inject(Location);

  isLoggedIn = this.authService.isLoggedIn;

  goBack(): void {
    this.location.back();
  }
}
