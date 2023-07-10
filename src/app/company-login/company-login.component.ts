import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CompanyService } from '../service/company.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-company-login',
  templateUrl: './company-login.component.html',
  styleUrls: ['./company-login.component.css']
})
export class CompanyLoginComponent {
  email: string = '';
  password: string = '';
  company: any = {};
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private companyService: CompanyService, public dialog: MatDialog) { }

  login() {
    const requestBody = { email: this.email, password: this.password };
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter Email and Password.';
      this.dialog.open(ErrorDialogComponent, {
        data: this.errorMessage,
      });
      return;
    }
    this.http.post('http://localhost:3000/api/company-login', requestBody).subscribe(
      (response: any) => {
        localStorage.setItem('userId', response.company.id);
        localStorage.setItem('email', response.company.email);
        this.companyService.setLoggedInUser(response.company);
        localStorage.setItem('token', response.token);
        this.router.navigate(['/overview-company']);
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
    this.companyService.setLoggedInUser(this.company);
  }
  goToCreateAccount() {
    this.router.navigate(['/company-account']);
  }
  goToUserLogin() {
    this.router.navigate(['/login']);
  }
}