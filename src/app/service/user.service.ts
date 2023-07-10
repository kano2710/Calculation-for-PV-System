import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedInUser: any = {};
  private apiUrl = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) { }
  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  setLoggedInUser(user: any) {
    this.loggedInUser = user;
  }

  getLoggedInUser() {
    return this.loggedInUser;
  }

  getUser(userId: string): Observable<User> {
    const url = `http://localhost:3000/api/user/${userId}`;
    return this.http.get<User>(url);
  }

  updateUser(userId: string, user: User): Observable<User> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.put<User>(url, user);
  }

  deleteUser(userId: string) {
    const url = `http://localhost:3000/api/user/${userId}`;
    return this.http.delete(url);
  }

  isUserFree(): boolean {
    const accountType = localStorage.getItem('accountType');
    return accountType === 'Free User';
  }
}



