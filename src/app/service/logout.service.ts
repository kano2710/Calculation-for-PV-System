import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  constructor(private http: HttpClient, private router: Router) { }

  logout(): Observable<any> {
    return this.http.post('http://localhost:3000/api/logout', {}).pipe(
      catchError((error) => {
        console.error('Error logging out:', error);
        return throwError(error);
      })
    );
  }

  public clearSessionData() {
    sessionStorage.removeItem('user');
  }

  private revokeTokens() {
    return this.http
      .post('http://localhost:3000/api/logout', {})
      .pipe(
        catchError((error) => {
          console.error('Error revoking tokens:', error);
          return throwError(error);
        })
      );
  }
}
