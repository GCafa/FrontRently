import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserRegistrationRequest } from '../../model/user-registration-request';
import {Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
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
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
        ]
      ],
      repeatPassword: ['', Validators.required]
    });
  }



  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) this.selectedImage = file;
  }
  // Dentro RegisterComponent

  passwordsMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const repeatPassword = this.registerForm.get('repeatPassword')?.value;
    return password === repeatPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid || !this.passwordsMatch()) {
      this.errorMessage = 'Le password non coincidono';
      return;
    }
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
