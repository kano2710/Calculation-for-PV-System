import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-company-account',
  templateUrl: './company-account.component.html',
  styleUrls: ['./company-account.component.css']
})
export class CompanyAccountComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) { }

  createAccount() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'All fields are required.';
      this.dialog.open(ErrorDialogComponent, {
        data: this.errorMessage,
      });
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.dialog.open(ErrorDialogComponent, {
        data: this.errorMessage,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Invalid email address.';
      this.dialog.open(ErrorDialogComponent, {
        data: this.errorMessage,
      });
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'Password should be at least 8 characters long.';
      this.dialog.open(ErrorDialogComponent, {
        data: this.errorMessage,
      });
      return;
    }

    const requestBody = { name: this.name, email: this.email, password: this.password };

    this.http.post('http://localhost:3000/api/create-company', requestBody).subscribe(
      (response: any) => {
        this.errorMessage = 'account created successfully.';
        this.dialog.open(ErrorDialogComponent, {
          data: this.errorMessage,
        });
        this.router.navigate(['/company-login']);
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        if (error.status === 409) {
          this.errorMessage = 'Email already exists.';
        } else {
          this.errorMessage = 'An error occurred while creating the account.';
        }
        this.dialog.open(ErrorDialogComponent, {
          data: this.errorMessage,
        });
      }
    );
  }
  goToLogin() {
    this.router.navigate(['/company-login']);
  }
}