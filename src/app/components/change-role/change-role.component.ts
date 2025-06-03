import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ChangeRoleRequest } from '../../model/change-role-request';

@Component({
  selector: 'app-change-role',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-role.component.html',
  styleUrls: ['./change-role.component.css']
})
export class ChangeRoleComponent {
  motivation = '';
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.motivation.trim()) {
      this.errorMessage = 'La motivazione è obbligatoria.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.userService.changeRoleRequest({ motivation: this.motivation }).subscribe({
      next: () => {
        this.successMessage = 'Richiesta inviata con successo!';
        this.motivation = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Errore nell\'invio della richiesta.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/personal-area']);
  }
}
