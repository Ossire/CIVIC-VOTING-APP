import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UpperCasePipe } from '@angular/common';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, UpperCasePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  public authService = inject(AuthService);

  user = computed(() => this.authService.currentUser());
  isAdmin = computed(() => this.user()?.role === 'admin');
  isLoggedIn = computed(() => !!this.user());

  logout() {
    this.authService.logout();
  }
}
