import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LogoutService } from '../service/logout.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  constructor(private router: Router, private logoutService: LogoutService) { }

  ngOnInit() {
    this.logout();
  }

  logout() {
    this.logoutService.logout().subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      (error: any) => {
        console.error('Error logging out:', error);
        this.logoutService.clearSessionData();
        this.router.navigate(['/login']);
      }
    );
  }
}