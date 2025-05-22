import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BodyPasswordReset } from '../../model/body-password-reset';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit, OnDestroy {
  formPasswordReset!: FormGroup;
  private passwordResetSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.formPasswordReset = this.fb.group({
      usernameMail: ['', [Validators.required, Validators.email]],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.formPasswordReset.invalid) {
      this.formPasswordReset.markAllAsTouched();
      return;
    }
    this.doPasswordReset();
  }

  private doPasswordReset(): void {
    const body: BodyPasswordReset = {
      usernameMail: this.formPasswordReset.get('usernameMail')!.value,
      oldPassword: this.formPasswordReset.get('oldPassword')!.value,
      newPassword: this.formPasswordReset.get('newPassword')!.value
    };

    // Subscription al metodo passwordReset che ritorna un boolean
    this.passwordResetSub = this.authService.passwordReset(body).subscribe({
      next: (success: boolean) => {
        if (success) {
          // redirect to login or show success message
        } else {
          // mostra messaggio di errore
        }
      },
      error: (err) => {
        // gestisci errori di rete o server
      }
    });
  }

  ngOnDestroy(): void {
    this.passwordResetSub?.unsubscribe();
  }
}
