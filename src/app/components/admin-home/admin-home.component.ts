import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RoleRequest {
  id: number;
  userId: number;
  username: string;
  currentRole: string;
  requestedRole: string;
  requestDate: Date;
}

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit {
  roleRequests: RoleRequest[] = [];

  ngOnInit() {
    // Simulo dei dati di esempio
    this.roleRequests = [
      {
        id: 1,
        userId: 101,
        username: 'mario.rossi',
        currentRole: 'user',
        requestedRole: 'editor',
        requestDate: new Date()
      },
      // Altri dati di esempio...
    ];
  }

  approveRequest(requestId: number) {
    // Implementare la logica per approvare
    console.log(`Richiesta ${requestId} approvata`);
    this.roleRequests = this.roleRequests.filter(req => req.id !== requestId);
  }

  rejectRequest(requestId: number) {
    // Implementare la logica per rifiutare
    console.log(`Richiesta ${requestId} rifiutata`);
    this.roleRequests = this.roleRequests.filter(req => req.id !== requestId);
  }
}
