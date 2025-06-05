import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CustomResponse } from '../../model/custom-response';
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
        if (err.status === 404){
          this.errorMessage = 'Utente non trovato. Assicurati di essere loggato.';
        }else if(err.status === 400){
          this.errorMessage = 'Password già usata. Scegline un\'altra.';
        }else {
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

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) this.selectedImage = file;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.modifyForm.invalid) return;

    // Reset dei messaggi precedenti
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

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
      next: (resp: CustomResponse) => {
        this.successMessage = 'Profilo aggiornato con successo! Verrai reindirizzato alla pagina di login.';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err) => {
        this.loading = false;
        console.log('Errore aggiornamento utente:', err);


        if (err.status === 400) {
          this.errorMessage = 'Password errata';
        } else if (err.status === 401) {
          this.errorMessage = 'Sessione scaduta. Effettua nuovamente il login.';
          setTimeout(() => this.router.navigate(['/login']), 1200);
        } else if (err.status === 403) {
          this.errorMessage = 'Non hai i permessi necessari per questa operazione.';
        } else if (err.status === 404) {
          this.errorMessage = 'Utente non trovato.';
        } else {
          this.errorMessage = err.error?.message || 'Errore durante l\'aggiornamento del profilo.';
        }
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

