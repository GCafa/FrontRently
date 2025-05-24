import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserRegistrationRequest } from '../../model/user-registration-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  selectedImage?: File;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required]

    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) this.selectedImage = file;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) return;

    const user: UserRegistrationRequest = this.registerForm.value;

    this.authService.register(user, this.selectedImage)
      .subscribe({
        next: (res) => {
          this.successMessage = 'Registrazione avvenuta con successo!';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Errore di registrazione';
          this.successMessage = '';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        }
      });
  }
}
