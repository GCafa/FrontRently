import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { UserService, User } from '../../services/user.service';
import { Router } from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-user-modify',
  templateUrl: './user-modify.component.html',
  styleUrls: ['./user-modify.component.css'],
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  standalone: true
})
export class UserModifyComponent implements OnInit {
  modifyForm: FormGroup | undefined;
  user: User | null = null;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        console.log('USER LOADED:', data);
        this.user = data;
        this.modifyForm = this.fb.group({
          username: [data.username, [Validators.required]],
          email: [data.email, [Validators.required, Validators.email]],
        });
        console.log('FORM:', this.modifyForm.value);
      },
      error: (err) => {
        this.errorMessage = 'Errore nel caricamento dati utente';
        console.error('ERROR USER LOADING:', err);
      }
    });
  }

  // Getter sicuro per i controlli del form
  get f() {
    return this.modifyForm ? this.modifyForm.controls : {};
  }

  onSubmit(): void {
    this.submitted = true;

    // Previene errori se il form non è pronto
    if (!this.modifyForm || this.modifyForm.invalid) return;

    const updatedUser: Partial<User> = {
      ...this.user,
      ...this.modifyForm.value
    };

  }
}
