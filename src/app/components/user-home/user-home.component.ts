import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class UserHomeComponent {
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.searchForm = this.fb.group({
      destination: ['', Validators.required],
      arrivalDate: ['', Validators.required],
      departureDate: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      console.log('Form data:', this.searchForm.value);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.router.navigate(['/home']);
  }


  ngOnInit() {
    this.startSlideshow();
  }

  private startSlideshow() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    setInterval(() => {
      // Rimuovi active da tutti gli slides
      slides.forEach(slide => slide.classList.remove('active'));

      // Aggiungi active allo slide corrente
      slides[currentSlide].classList.add('active');

      // Passa al prossimo slide
      currentSlide = (currentSlide + 1) % slides.length;
    }, 5000); // Cambia ogni 5 secondi
  }
}
