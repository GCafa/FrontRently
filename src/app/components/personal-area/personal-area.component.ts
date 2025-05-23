import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-personal-area',
  standalone: true,
  imports: [NgIf],
  templateUrl: './personal-area.component.html',
  styleUrls: ['./personal-area.component.css']
})
export class PersonalAreaComponent implements OnInit {
  user: User | null = null;
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => this.user = data,
      error: (err) => this.errorMessage = 'Errore nel caricamento dell’utente.'
    });
  }
}
