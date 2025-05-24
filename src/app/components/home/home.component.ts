import { Component, OnInit, OnDestroy } from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [
    RouterModule
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  images = [
    'assets/images/img01.jpg',
    'assets/images/img02.jpg',
    'assets/images/img03.jpg',
    'assets/images/img04.jpg',
    'assets/images/img05.jpg'
  ];
  currentIndex = 0;
  intervalId: any;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 2500); // ogni 2,5 secondi cambia immagine
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
