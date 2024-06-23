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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  username: string = '';
  password: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        if (response.statusCode === 200) {
          this.router.navigate(['/home']);
        } else if (response.statusCode === 402) {
          this.router.navigate(['/confirmation']);
        } else if (
          response.statusCode === 404 &&
          response.body === 'NEW_PASSWORD_REQUIRED'
        ) {
          this.router.navigate(['/reset-password'], {
            queryParams: { session: response.session },
          });
        } else {
          this.errorMessage = response.body;
        }
      },
      (error) => {
        this.errorMessage = 'Login failed. Please try again.';
      }
    );
  }
}
