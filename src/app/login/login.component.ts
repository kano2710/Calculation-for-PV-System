import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import * as bcrypt from 'bcryptjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email: string = '';
  password: string = '';
  user: any = {};
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private userService: UserService, public dialog: MatDialog) { }

  login() {
    const requestBody = { email: this.email, password: this.password };
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter Email and Password.';
      this.dialog.open(ErrorDialogComponent, {
        data: this.errorMessage,
      });
      return;
    }

    this.http.post('http://localhost:3000/api/login', requestBody).subscribe(
      (response: any) => {
        localStorage.setItem('userId', response.user.id);
        localStorage.setItem('email', response.user.email);
        localStorage.setItem('accountType', response.user.accountType);
        localStorage.setItem('token', response.token);
        this.userService.setLoggedInUser(response.user);
        this.router.navigate(['/overview']);
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.status === 403) {
          this.errorMessage = 'Account is not exist.';
        } else {
          this.errorMessage = 'An error occurred while logging in. Please try again later.';
        }
        this.dialog.open(ErrorDialogComponent, {
          data: this.errorMessage,
        });
      }
    );
    this.userService.setLoggedInUser(this.user);
  }

  goToCreateAccount() {
    this.router.navigate(['/create-account']);
  }

  goToCompanyAccount() {
    this.router.navigate(['/company-login']);
  }
}