import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UserModifyRequest } from '../../model/user-modify-request';
import { UserModifyResponse } from '../../model/user-modify-response';
import { User } from '../../model/user';

@Component({
  selector: 'app-user-modify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-modify.component.html',
  styleUrls: ['./user-modify.component.css']
})
export class UserModifyComponent implements OnInit {
  user: User | null = null;
  modifyForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  loading = true;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Inizializza il form vuoto
    this.initializeForm(null);
  }

  private initializeForm(data: User | null) {
    this.modifyForm = this.fb.group({
      username: [data?.username || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      firstname: [data?.firstname || '', Validators.required],
      lastname: [data?.lastname || '', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data: User) => {
        this.user = data;
        this.initializeForm(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore API:', err);
        this.errorMessage = 'Errore nel caricamento dei dati utente';
        this.loading = false;
        if (err.status === 405) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  get f() {
    return this.modifyForm.controls;
  }

  getUserImageUrl(): string {
    return this.user?.imageUrl
      ? `http://localhost:8080/api/v1/user/image/${this.user.imageUrl}`
      : 'http://localhost:8080/api/v1/user/image/defaultProfileImage.png';
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.modifyForm.invalid) return;

    const updateRequest: UserModifyRequest = { ...this.modifyForm.value };

    this.userService.updateUser(updateRequest).subscribe({
      next: (resp: UserModifyResponse) => {
        this.successMessage = 'Profilo aggiornato con successo!';
        if (resp?.user) {
          this.user = resp.user;
        }
        setTimeout(() => this.router.navigate(['/personal-area']), 1200);
      },
      error: (err) => {
        console.error('Errore aggiornamento:', err);
        this.errorMessage = "Errore durante l'aggiornamento del profilo.";
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
