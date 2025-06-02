import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { BodyChangePassword } from '../../model/body-change-password';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  passwordData: BodyChangePassword = {
    currentPassword: '',
    newPassword: ''
  };
  errorMessage = '';
  successMessage = '';
  showCurrentPassword = false;
  showNewPassword = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit() {
    this.userService.changePassword(this.passwordData).subscribe({
      next: () => {
        this.successMessage = 'Password cambiata con successo!';
        setTimeout(() => this.router.navigate(['/personal-area']), 2000);
      },
      error: (err) => {
        this.errorMessage = 'Errore nel cambio password. Riprova.';
      }
    });
  }

  goBack() {
    this.router.navigate(['/personal-area']);
  }
}
