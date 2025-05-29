import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UserModifyResponse } from '../../model/user-modify-response';
import { User } from '../../model/user';
import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-modify',
  templateUrl: './user-modify.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgClass
  ],
  styleUrls: ['./user-modify.component.css']
})
export class UserModifyComponent implements OnInit {
  user: User | null = null;
  modifyForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  loading = true;
  selectedImage?: File;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data: User) => {
        this.user = data;
        this.modifyForm = this.fb.group({
          username: [data.username, Validators.required],
          email: [data.email, [Validators.required, Validators.email]],
          password: ['', Validators.required]
        });
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Errore nel caricamento dei dati utente';
        this.loading = false;
        if (err.status === 405) this.router.navigate(['/login']);
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

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) this.selectedImage = file;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.modifyForm.invalid) return;

    const formData = new FormData();
    formData.append(
      'UserModifyRequest',
      JSON.stringify(this.modifyForm.value)
    );
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    // CHIAMA POST su /modify NON PUT su /me!
    this.userService.updateUser(formData).subscribe({
      next: (resp: UserModifyResponse) => {
        this.successMessage = 'Profilo aggiornato con successo!';
        setTimeout(() => this.router.navigate(['/personal-area']), 1200);
      },
      error: () => {
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
