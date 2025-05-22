import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  rooms = [
    { title: 'Camera Standard', price: 80, image: 'https://source.unsplash.com/400x300/?bedroom' },
    { title: 'Camera Deluxe', price: 120, image: 'https://source.unsplash.com/400x300/?hotel' },
    { title: 'Vista Mare', price: 150, image: 'https://source.unsplash.com/400x300/?sea,room' }
  ];

  sidebarCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  /*logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }*/
}
