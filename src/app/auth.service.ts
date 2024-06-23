// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  username?: string;

  constructor(private http: HttpClient) {}

  signup(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, { username, password });
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response) => {
          if (response.statusCode === 402) {
            // User not confirmed
            throw new Error(
              'User is not confirmed. Please verify your email and complete the registration process.'
            );
          } else if (response.statusCode === 404) {
            // Additional authentication required
            localStorage.setItem('session', response.session);
          } else if (response.statusCode === 200) {
            this.username = username;
            // Successful login
            // You may want to store user data or token here
          }
        }),
        catchError((error) => {
          let errorMessage = 'An error occurred. Please try again.';
          if (error.error && error.error.body) {
            errorMessage = error.error.body;
          }
          return of({ error: true, message: errorMessage });
        })
      );
  }
  confirmSignup(username: string, confirmationCode: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/confirmsignup`, {
      username,
      confirmationCode,
    });
  }

  resetPassword(
    username: string,
    newPassword: string,
    session: string
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/resetpassword`, {
      username,
      newPassword,
      session,
    });
  }
}
