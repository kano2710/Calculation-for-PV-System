import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { User } from '../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { NgForm } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  user: User = new User();
  errorMessage: string = '';
  sqlQuery: string = '';
  response: string = '';
  updating = false;
  password: string = '';

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    const loggedInUserId = localStorage.getItem('userId');
    if (loggedInUserId) {
      this.userService.getUser(loggedInUserId).subscribe(
        (response: any) => {
          this.user = response.user;
        },
        (error: any) => {
          console.error('Error fetching user data:', error);
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
    if (this.user.password.length < 8) {
      this.errorMessage = 'Password should be at least 8 characters long.';
      this.dialog.open(ErrorDialogComponent, {
        data: this.errorMessage,
      });
      this.user.password = '';
      return;
    }

    this.updating = true;
    const loggedInUserId = localStorage.getItem('userId');
    this.userService.updateUser(String(loggedInUserId), this.user).subscribe(
      () => {
        this.errorMessage = 'User information updated';
        this.dialog.open(ErrorDialogComponent, {
          data: this.errorMessage,
        });
        this.user.password = '';
        this.errorMessage = '';
        this.updating = false;
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating user information:', error);
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized to update the user information.';
        } else {
          this.errorMessage = 'Error updating user information. Please try again later.';
        }
        this.dialog.open(ErrorDialogComponent, {
          data: this.errorMessage,
        });
        this.updating = false;
      }
    );
  }

  private validateFields(): boolean {
    if (!this.user.name || !this.user.email || !this.user.password) {
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
          this.userService.deleteUser(loggedInUserId).subscribe(
            () => {
              this.router.navigate(['/login']);
            },
            (error: HttpErrorResponse) => {
              console.error('Error deleting user account:', error);
              this.errorMessage = 'Error deleting user account. Please try again later.';
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