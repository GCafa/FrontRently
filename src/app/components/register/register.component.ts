import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {FormControl, FormControlName, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BodyRegister} from '../../model/body-register';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatFormField,
    MatLabel,
    MatButton,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true,
})
export class RegisterComponent implements OnInit, OnDestroy{
  formRegister: FormGroup;

  //Subscription
  registerSub: Subscription;

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.formRegister = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
    })
  }

  register(): void {
    const body: BodyRegister = this.formRegister.value;
    this.registerSub = this.authService.register(body).subscribe({
      next: (esito) => {
        if(esito) {
          //redirect sulla login
        } else {
          //mostro messaggio di errore
        }
      }
    })

  }

  ngOnDestroy() {
    this.registerSub?.unsubscribe();
  }
}
