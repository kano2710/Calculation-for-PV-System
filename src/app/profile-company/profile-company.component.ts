import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CompanyService } from '../service/company.service';
import { Company } from '../models/company.model';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { NgForm } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-profile-company',
  templateUrl: './profile-company.component.html',
  styleUrls: ['./profile-company.component.css']
})

export class ProfileCompanyComponent implements OnInit {
  company: Company = new Company();
  errorMessage: string = '';
  sqlQuery: string = '';
  response: string = '';
  updating = false;
  password: string = '';

  constructor(private companyService: CompanyService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    const loggedInUserId = localStorage.getItem('userId');
    if (loggedInUserId) {
      this.companyService.getUser(loggedInUserId).subscribe(
        (response: any) => {
          this.company = response.company;        
        },
        (error: any) => {
          console.error('Error fetching company data:', error);
        }
      );
    }
    this.route.paramMap.subscribe((params) => {
      const response = params.get('response');
    });
  }
  
  updateProfile() {
    if (!this.validateFields()) {
      this.errorMessage = 'Please fill in all the required fields.';
      this.dialog.open(ErrorDialogComponent, {
        data: this.errorMessage,
      });      
      return;
    }
    if (this.company.password.length < 8) {
      this.errorMessage = 'Password should be at least 8 characters long.';
      this.dialog.open(ErrorDialogComponent, {
        data: this.errorMessage,
      });
      this.company.password = '';
      return;
    }

    this.updating = true;
    const loggedInUserId = localStorage.getItem('userId');
    this.companyService.updateUser(String(loggedInUserId), this.company).subscribe(
      () => {
        this.errorMessage = 'Company information updated';
        this.dialog.open(ErrorDialogComponent, {
          data: this.errorMessage,
        });
         this.company.password = '';
        this.errorMessage = '';
        this.updating = false;
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating company information:', error);
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized to update the company information.';
        } else {
          this.errorMessage = 'Error updating company information. Please try again later.';
        }
        this.dialog.open(ErrorDialogComponent, {
          data: this.errorMessage,
        });
        this.updating = false;
      }
    );
  }
  
  private validateFields(): boolean {
    if (!this.company.name || !this.company.email || !this.company.password) {
      return false;
    }
    return true;
  }

  deleteAccount() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete your account?',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const loggedInUserId = localStorage.getItem('userId');
        if (loggedInUserId) {
          this.companyService.deleteUser(loggedInUserId).subscribe(
            () => {
              this.router.navigate(['/company-login']);
            },
            (error: HttpErrorResponse) => {
              console.error('Error deleting Company account:', error);
              this.errorMessage = 'Error deleting Company account. Please try again later.';
            }
          );
        }
      }
    });
  }

  resetForm(form: NgForm) {
    form.reset();
  }
}