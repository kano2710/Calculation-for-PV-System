import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-project-company',
  templateUrl: './project-company.component.html',
  styleUrls: ['./project-company.component.css']
})
export class ProjectCompanyComponent {
  email: string = '';
  name: string = '';
  description1: string = '';
  description2: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.email = localStorage.getItem('email') || '';
  }

  createProject(): void {
    const projectData = {
      company: this.email,
      name: this.name,
      description1: this.description1,
      description2: this.description2
    };
    if (!this.name || !this.description1 || !this.description2) {
      this.errorMessage = 'Please fill details of Product.';
      this.dialog.open(ErrorDialogComponent, {
        data: this.errorMessage,
      });
      return;
    }

    this.http.post('http://localhost:3000/api/company', projectData).subscribe(
      () => {
        this.name = '';
        this.description1 = '';
        this.description2 = '';
        this.errorMessage = '';
        this.errorMessage = ' Product added successfully.';
        this.dialog.open(ErrorDialogComponent, {
          data: this.errorMessage,
        });
      },
      (error) => {
        this.errorMessage = 'An error occurred while creating the project.';
        console.error(error);
      }
    );
  }
}