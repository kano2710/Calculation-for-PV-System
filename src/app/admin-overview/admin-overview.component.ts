import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.css']
})
export class AdminOverviewComponent implements OnInit{
  users: any[] = [];
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get<any[]>('http://localhost:3000/api/admin').subscribe(
      (response: any[]) => {
        this.users = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  logout() {
    this.clearSessionData();
    this.clearCookieData();
    this.router.navigate(['/admin']);
  }

  private clearSessionData() {
  }

  private clearCookieData() {
  }
}
