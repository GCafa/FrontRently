import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-personal-area',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './personal-area.component.html',
  styleUrls: ['./personal-area.component.css']
})
export class PersonalAreaComponent implements OnInit {
  user?: User;
  loading = true;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Errore nel caricamento utente';
        this.loading = false;
      }
    });
  }

  onImageError() {
    if (this.user) {
      this.user.imageUrl = '';
    }
  }

  logout() {
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
