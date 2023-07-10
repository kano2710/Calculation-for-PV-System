import { Component, EventEmitter, OnInit, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProjectService } from '../service/project.service';
import { AxiosResponse } from 'axios';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

interface CoordinatesResponse {
  latitude: string;
  longitude: string;
  temperature: string;
  clouds: string;
}

@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css']
})
export class ProjectAddComponent implements OnInit, OnChanges {
  @Input() projectName: string = '';
  project: any[] = [];
  userId: string = '';
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
  email: string = '';
  projects: any[] = [];
  selectedProjectName = '';

  constructor(private projectService: ProjectService, private http: HttpClient) {
    const loggedInUserId = localStorage.getItem('userId');
  }
  ngOnInit(): void {
    this.projectService.fetchData().then((res: AxiosResponse) => {
      this.project = res.data;
    }).catch((err: Error) => {
      console.log(err);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['projectName']) {
    }
  }
  @Output() projectAdded = new EventEmitter<any>();

  addProject(item: any, form: NgForm) {
    const projectAdded = {
      id: item.id,
      userId: this.userId,
      name: this.projectName,
      city: this.city,
      powerPeak: this.powerPeak,
      tilt: this.tilt,
      area: this.area,
      longitude: this.longitude,
      latitude: this.latitude,
      clouds: this.clouds,
      systemLoss: this.systemLoss
    };
    this.projectAdded.emit(projectAdded);
    this.resetForm(form);
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
        this.powerPeak = data.temperature;
        this.clouds = data.clouds;

      });
  }
  resetForm(form: NgForm) {
    form.reset();
  }

}
