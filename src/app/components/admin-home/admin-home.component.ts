import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { User } from '../../model/user';
import { CustomResponse} from "../../model/custom-response";

@Component({
  selector: 'app-admin',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminHomeComponent implements OnInit {
  currentUser: User | null = null;
  users: User[] = [];
  changeRoleRequests: any[] = []; // TODO: definire interfaccia per le richieste
  loading = false;
  showRejectionForm = false;
  rejectionMotivation = '';
  selectedRequestId: number | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadUsers();
  }

  private loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.handleError('Errore nel caricamento degli utenti');
        this.loading = false;
      }
    });
  }

  getUserStatusText(enabled: boolean): string {
    return enabled ? 'Attivo' : 'Disabilitato';
  }

  enableUser(userId: number): void {
    this.adminService.enableUser(userId).subscribe({
      next: () => {
        this.loadUsers();
        this.showSuccess('Utente abilitato con successo');
      },
      error: () => this.handleError('Errore durante l\'abilitazione dell\'utente')
    });
  }

  disableUser(userId: number): void {
    this.adminService.disableUser(userId).subscribe({
      next: () => {
        this.loadUsers();
        this.showSuccess('Utente disabilitato con successo');
      },
      error: () => this.handleError('Errore durante la disabilitazione dell\'utente')
    });
  }

  acceptChangeRole(requestId: number): void {
    this.adminService.acceptChangeRole(requestId).subscribe({
      next: () => {
        this.loadUsers();
        this.showSuccess('Richiesta accettata con successo');
      },
      error: () => this.handleError('Errore durante l\'accettazione della richiesta')
    });
  }

  showRejectionDialog(requestId: number): void {
    this.selectedRequestId = requestId;
    this.showRejectionForm = true;
  }

  rejectChangeRole(): void {
    if (!this.selectedRequestId || !this.rejectionMotivation.trim()) {
      return;
    }

    this.adminService.rejectChangeRole(this.selectedRequestId, this.rejectionMotivation).subscribe({
      next: () => {
        this.showSuccess('Richiesta rifiutata con successo');
        this.cancelRejection();
      },
      error: () => this.handleError('Errore durante il rifiuto della richiesta')
    });
  }

  cancelRejection(): void {
    this.showRejectionForm = false;
    this.selectedRequestId = null;
    this.rejectionMotivation = '';
  }

  private showSuccess(message: string): void {
    console.log('Successo:', message);
    // Implementare la logica per mostrare i messaggi di successo
  }

  private handleError(error: string): void {
    console.error('Errore:', error);
    // Implementare la logica per mostrare gli errori
  }
}
