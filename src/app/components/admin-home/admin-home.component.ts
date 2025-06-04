import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { User } from '../../model/user';
import { RouterModule, Router } from '@angular/router';
import { ChangeRoleResponse } from '../../model/change-role-response';

@Component({
  selector: 'app-admin',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class AdminHomeComponent implements OnInit {
  currentUser: User | null = null;
  users: User[] = [];
  changeRoleRequests: ChangeRoleResponse[] = [];
  loading = false;
  showRejectionForm = false;
  rejectionMotivation = '';
  selectedRequestId: number | null = null;

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadUsers();
    this.getAllChangeRoleRequests();
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

  getUserStatusText(isActive: boolean): string {
    return isActive ? 'Abilitato' : 'Disabilitato';
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

  getAllChangeRoleRequests() {
    this.adminService.getAllChangeRoleRequests().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.changeRoleRequests = response.map(req => ({
            ...req,
            requestid: req.id || req.requestid
          }));
          console.log('Richieste caricate:', this.changeRoleRequests);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore API:', err);
        this.handleError('Errore nel caricamento delle richieste');
        this.loading = false;
      }
    });
  }

  get pendingRequests(): ChangeRoleResponse[] {
    return this.changeRoleRequests.filter(request =>
      request && request.status === 'PENDING'
    );
  }

  acceptChangeRole(requestid: number): void {
    if (!requestid) {
      console.error('ID richiesta non valido:', requestid);
      return;
    }

    this.loading = true;
    this.adminService.acceptChangeRole(requestid).subscribe({
      next: () => {
        this.getAllChangeRoleRequests();
        this.loadUsers();
        this.showSuccess('Richiesta accettata con successo');
      },
      error: (err) => {
        console.error('Errore accettazione:', err);
        this.handleError('Errore durante l\'accettazione della richiesta');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  showRejectionDialog(requestid: number): void {
    this.selectedRequestId = requestid;
    this.showRejectionForm = true;
  }

  rejectChangeRole(): void {
    if (!this.selectedRequestId || !this.rejectionMotivation.trim()) {
      return;
    }

    this.loading = true;
    this.adminService.rejectChangeRole(this.selectedRequestId, this.rejectionMotivation).subscribe({
      next: () => {
        this.getAllChangeRoleRequests();
        this.showSuccess('Richiesta rifiutata con successo');
        this.cancelRejection();
      },
      error: () => this.handleError('Errore durante il rifiuto della richiesta'),
      complete: () => {
        this.loading = false;
      }
    });
  }

  cancelRejection(): void {
    this.showRejectionForm = false;
    this.selectedRequestId = null;
    this.rejectionMotivation = '';
  }

  private showSuccess(message: string): void {
    console.log('Successo:', message);
  }

  private handleError(error: string): void {
    console.error('Errore:', error);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');

    this.router.navigate(['/home'])
      .then(() => {
        location.reload();
      });
  }
}
