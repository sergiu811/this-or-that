// confirmation.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent {
  username: string = '';
  confirmationCode: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onConfirm() {
    const confirmationObserver: Observer<any> = {
      next: (response) => {
        if (response.statusCode === 200) {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Confirmation failed. Please try again.';
        }
      },
      error: (error) => {
        this.errorMessage = 'An error occurred. Please try again.';
      },
      complete: () => {},
    };

    this.authService
      .confirmSignup(this.username, this.confirmationCode)
      .subscribe(confirmationObserver);
  }
}
