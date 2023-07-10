import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(private http: HttpClient, private router: Router) { }
  name = '';
  password = '';
  login() {
    const requestBody = { name: this.name, password: this.password };

    this.http.post<any>('http://localhost:3000/api/admin', requestBody).subscribe(
      (response: any) => {
        this.router.navigate(['/admin-overview']);
      },
    );
  }
}
