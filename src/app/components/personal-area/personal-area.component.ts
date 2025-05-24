import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personal-area.component.html',
  styleUrls: ['./personal-area.component.css']
})
export class PersonalAreaComponent implements OnInit {
  user: User | null = null;
  errorMessage = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: () => {
        this.errorMessage = 'Errore nel caricamento dei dati utente';
      }
    });
  }

  // Funzione che restituisce l’URL dell’immagine
  getUserImageUrl(): string {
    if (!this.user?.imageUrl) {
      // Fallback: immagine di default servita dal backend
      return 'http://localhost:8080/api/v1/user/image/defaultProfileImage.png';
    }
    // Se imageUrl contiene già un URL assoluto, puoi fare un controllo più smart qui!
    return 'http://localhost:8080/api/v1/user/image/' + this.user.imageUrl;
  }

  logout() {
    // Cancella il token JWT/localStorage, secondo come salvi il login
    localStorage.removeItem('token'); // Se usi localStorage
    sessionStorage.removeItem('token'); // Se usi sessionStorage
    // Eventuale altro cleanup...

    // Redirect alla pagina di login (o home)
    this.router.navigate(['/login']);
  }
}
