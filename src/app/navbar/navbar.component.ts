import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from '../service/logout.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private router: Router, private logoutService: LogoutService) {}

}
