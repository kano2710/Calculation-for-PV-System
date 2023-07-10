import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios from 'axios'

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  apiUrl = 'http://localhost:3000/api/project';

  constructor(private http: HttpClient) { }

  fetchData() {
    return axios.get('http://localhost:3000/api/project');
  }

  getProject(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addProject(project: any): Observable<any> {
    return this.http.post(this.apiUrl, project);
  }

  updateProject(project: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${project.id}`, project);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  deleteProduct(): void {
    this.http.delete(`http://localhost:3000/api/product`).subscribe(
      (response) => {
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );
  }
}