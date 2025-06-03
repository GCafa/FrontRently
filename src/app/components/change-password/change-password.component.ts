import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserPasswordChangeRequest } from '../../model/user-password-change-request';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChangePasswordComponent {
  passwordData: UserPasswordChangeRequest= {
    currentPassword: '',
    newPassword: '',
    repeatNewPassword: ''
  };

  showCurrentPassword = false;
  showNewPassword = false;
  showRepeatPassword = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validatePasswords()) {
      return;
    }

    this.userService.changePassword(this.passwordData)
      .subscribe({
        next: () => {
          this.successMessage = 'Password modificata con successo';
          this.resetForm();
          setTimeout(() => this.goBack(), 2000);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Errore:', error);
          if (error.status === 400) {
            this.errorMessage = error.error?.message || 'I dati inseriti non sono validi';
          } else if (error.status === 401) {
            this.errorMessage = 'Password attuale non corretta';
          } else {
            this.errorMessage = 'Si è verificato un errore durante il cambio password';
          }
        }
      });
  }

  private validatePasswords(): boolean {
    if (!this.passwordData.currentPassword ||
      !this.passwordData.newPassword ||
      !this.passwordData.repeatNewPassword) {
      this.errorMessage = 'Tutti i campi sono obbligatori';
      return false;
    }

    if (this.passwordData.currentPassword === this.passwordData.newPassword) {
      this.errorMessage = 'La nuova password deve essere diversa da quella attuale';
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.passwordData.newPassword)) {
      this.errorMessage = 'La nuova password deve contenere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale';
      return false;
    }

    if (this.passwordData.newPassword !== this.passwordData.repeatNewPassword) {
      this.errorMessage = 'Le nuove password non coincidono';
      return false;
    }

    return true;
  }

  private resetForm() {
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      repeatNewPassword: ''
    };
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showRepeatPassword = false;
  }

  goBack() {
    this.router.navigate(['/personal-area']);
  }
}
