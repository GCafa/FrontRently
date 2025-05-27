import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';
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

  getUserImageUrl(): string {
    if (!this.user?.imageUrl) {
      return 'http://localhost:8080/api/v1/user/image/defaultProfileImage.png';
    }
    return 'http://localhost:8080/api/v1/user/image/' + this.user.imageUrl;
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
