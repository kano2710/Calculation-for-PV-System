import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from '../service/logout.service';

@Component({
  selector: 'app-nabar-company',
  templateUrl: './nabar-company.component.html',
  styleUrls: ['./nabar-company.component.css']
})
export class NabarCompanyComponent {
  constructor(private router: Router, private logoutService: LogoutService) {}

}
