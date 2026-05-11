import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  // The list of states for the dropdown
  states = [
    'Lagos',
    'Abuja',
    'Rivers',
    'Kano',
    'Ogun',
    'Anambra',
    'Enugu',
    'Edo',
    'Delta',
    'Kaduna',
  ];

  signupForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    state: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Changed .register() to .signup() to match the AuthService
    this.authService.signup(this.signupForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Navigate to the poll list after successful mock signup
        this.router.navigate(['/polls']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'An error occurred during signup');
      },
    });
  }
}
