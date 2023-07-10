import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  loggedInUser: any = {};
  private apiUrl = 'http://localhost:3000/api/company';

  constructor(private http: HttpClient) { }
  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  setLoggedInUser(company: any) {
    this.loggedInUser = company;
  }

  getLoggedInUser() {
    return this.loggedInUser;
  }

  getUser(userId: string): Observable<Company> {
    const url = `http://localhost:3000/api/company/${userId}`;
    return this.http.get<Company>(url);
  }

  updateUser(userId: string, company: Company): Observable<Company> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.put<Company>(url, company);
  }

  deleteUser(userId: string) {
    const url = `http://localhost:3000/api/company/${userId}`;
    return this.http.delete(url);
  }
}
