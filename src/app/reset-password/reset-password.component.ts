import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  errorMessage: string = '';
  session: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      username: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', Validators.required],
    });

    // Retrieve session from local storage or another appropriate source
    this.session = localStorage.getItem('session');
  }

  onResetPassword(): void {
    if (
      this.resetPasswordForm.valid &&
      this.resetPasswordForm.value.newPassword ===
        this.resetPasswordForm.value.confirmNewPassword
    ) {
      const { username, newPassword } = this.resetPasswordForm.value;
      if (this.session) {
        this.authService
          .resetPassword(username, newPassword, this.session)
          .subscribe(
            () => {
              this.router.navigate(['/login']);
            },
            (error) => {
              if (error.status === 405) {
                this.errorMessage = 'Password does not meet the requirements.';
              } else {
                this.errorMessage = 'Reset password failed. Please try again.';
              }
            }
          );
      } else {
        this.errorMessage = 'Session is missing.';
      }
    } else if (
      this.resetPasswordForm.value.newPassword !==
      this.resetPasswordForm.value.confirmNewPassword
    ) {
      this.errorMessage = 'Passwords do not match.';
    }
  }
}
