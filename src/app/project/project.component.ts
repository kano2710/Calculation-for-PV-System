import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ProjectService } from '../service/project.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

interface CoordinatesResponse {
  latitude: string;
  longitude: string;
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})

export class ProjectComponent implements OnInit {
  selectedProject: any;
  userId: string = '';
  name: string = '';
  city: string = '';
  powerPeak: string = '';
  orientation: string = '';
  tilt: number = 30.00;
  area: number = 10.00;
  longitude = '';
  latitude = '';
  clouds = '';
  systemLoss: number = 14;
  errorMessage: string = '';
  displayProject = false;
  displayProjectIndex: number = -1;
  email: string = '';
  projects: any[] = [];

  constructor(private http: HttpClient, private userService: UserService, private route: ActivatedRoute, private router: Router, private projectService: ProjectService, public dialog: MatDialog) {
    const loggedInUserId = localStorage.getItem('userId');
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.http.get<any[]>(`http://localhost:3000/api/product/${userId}`).subscribe(
      (projects: any[]) => {
        this.projects = projects;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onCityChange(city: string) {
    this.city = city;
    this.getCoordinates();
  }

  getCoordinates() {
    this.http.get<CoordinatesResponse>(`http://localhost:3000/api/coordinates?city=${this.city}`)
      .subscribe(data => {
        this.latitude = data.latitude;
        this.longitude = data.longitude;
      });
  }

  toggleProjectDisplay(index: number, project: any) {
    if (this.displayProjectIndex === index) {
      this.displayProjectIndex = -1;
      this.selectedProject = null;
    } else {
      this.displayProjectIndex = index;
      this.selectedProject = project;
    }
  }

  addProjectName(projectId: any, form: NgForm) {

    const isFreeUser = this.userService.isUserFree();
    if (isFreeUser && this.projects.length > 0) {
      this.errorMessage = 'Free users can create only 1 project.';
      this.dialog.open(ErrorDialogComponent, {
        data: this.errorMessage,
      });
      this.resetForm(form);
      return;
    }
    const projectName = {
      userId: localStorage.getItem('userId'),
      name: this.name,
      productId: projectId,
    };
    if (!this.name) {
      this.errorMessage = 'Please enter project name';
      this.dialog.open(ErrorDialogComponent, {
        data: this.errorMessage,
      });
      return;
    }
    this.http.post('http://localhost:3000/api/project', projectName).subscribe(
      res => {
        this.errorMessage = 'Project successfully added!';
        this.dialog.open(ErrorDialogComponent, {
          data: this.errorMessage,
        });
        this.resetForm(form);

        const userId = localStorage.getItem('userId');
        this.http.get<any[]>(`http://localhost:3000/api/product/${userId}`).subscribe(
          (projects: any[]) => {
            this.projects = projects;
          },
          (error) => {
            console.error(error);
          }
        );
        return;
      },
      err => {
        console.error('Error occurred:', err);
      }
    );

  }

  addProject(project: any, form: NgForm) {
    const userId = localStorage.getItem('userId');
    const projectAdded = {
      userId: userId,
      productId: project.id,
      name: project.name,
      city: project.city,
      powerPeak: project.powerPeak,
      tilt: project.tilt,
      area: project.area,
      longitude: project.longitude,
      latitude: project.latitude,
      clouds: project.clouds,
      systemLoss: project.systemLoss
    };
    
  if (!project.city){
    this.errorMessage = 'All fields are required!';
    this.dialog.open(ErrorDialogComponent, {
      data: this.errorMessage,
    });
    return;
  }
  
        this.http.get<any[]>(`http://localhost:3000/api/product/${userId}`).subscribe(
      (projects: any[]) => {
        this.projects = projects;
        this.projects.forEach(project => {
        });
        const product = this.projects.find(p => userId === userId);
        const isFreeUser = this.userService.isUserFree();
        if (isFreeUser && this.projects.length >= 3) {
          this.errorMessage = 'Free users can add only 3 product.';
          this.dialog.open(ErrorDialogComponent, {
            data: this.errorMessage,
          });
          return;
        }

        if (project.city === null || project.city === '') {

          this.http.put(`http://localhost:3000/api/product/${userId}`, projectAdded).subscribe(
            (res) => {
              this.errorMessage = 'Project successfully updated!';
              this.dialog.open(ErrorDialogComponent, {
                data: this.errorMessage,
              });
              this.resetForm(form);
              this.projectService.deleteProduct();
            },
            (err) => {
              console.error('Error occurred:', err);
            }
          );
        } else {
          this.http.post('http://localhost:3000/api/product', projectAdded).subscribe(
            (res) => {
              this.errorMessage = 'Project successfully added!';
              this.dialog.open(ErrorDialogComponent, {
                data: this.errorMessage,
              });
              this.resetForm(form);
              this.projectService.deleteProduct();
            },
            (err) => {
              console.error('Error occurred:', err);
            }
          );
        }
      
      }
    );
}
  resetForm(form: NgForm) {
    form.reset();
  }
}


