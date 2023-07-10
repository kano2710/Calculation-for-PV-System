import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../service/user.service'; // import UserService instead of AuthService

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) { } // use UserService

  canActivate(): boolean {
    if (!this.userService.isAuthenticated()) { // use userService
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
