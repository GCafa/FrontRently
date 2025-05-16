import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { BodyRegister } from '../../model/body-register';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    HttpClientModule,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      agreeTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordsMatchValidator
    });

    // Aggiorna la validazione della conferma password in tempo reale (FIX definitivo)
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity({ onlySelf: true });
    });
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.registerForm.get('password')?.updateValueAndValidity({ onlySelf: true });
    });
  }

  // Validator custom per password = conferma password
  private passwordsMatchValidator(form: FormGroup) {
    const pw = form.get('password')?.value;
    const cpw = form.get('confirmPassword')?.value;
    return pw === cpw ? null : { passwordsMismatch: true };
  }

  // Getter breve per i controlli del form
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    const payload: BodyRegister = {
      firstname: this.f['firstName'].value,
      lastname: this.f['lastName'].value,
      username: this.f['username'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      repeatPassword: this.f['confirmPassword'].value
    };

    this.authService.register(payload).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.successMessage = 'Registrazione avvenuta con successo!';
          this.registerForm.reset({ agreeTerms: false });
          this.submitted = false;
          setTimeout(() => this.router.navigate(['/home']), 1000); // Redirect dopo 1 secondo
        } else {
          this.errorMessage = 'Errore durante la registrazione.';
        }
      },
      error: err => {
        console.error('Registrazione fallita', err);
        this.errorMessage = err.error?.message || 'Errore durante la registrazione.';
      }
    });
  }
}
