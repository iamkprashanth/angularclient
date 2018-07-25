import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models';
import { map, distinctUntilChanged } from 'rxjs/operators';


@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
       // Set current user data into observable
       this.currentUserSubject.next(this.currentUserSubject.value);
       // Set isAuthenticated to true
       this.isAuthenticatedSubject.next(true);
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(accessToken) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(accessToken);
    return this.apiService.get('/api/user/me')
      .pipe(map(
        data => {
          // Set current user data into observable
          this.currentUserSubject.next(data);
          // Set isAuthenticated to true
          this.isAuthenticatedSubject.next(true);
        }
      ));
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(credentials): Observable<any> {
    // const route = (type === 'login') ? '/login' : '';
    // return this.apiService.post('/users' + route, {user: credentials})
    return this.apiService.post('/auth/signin', credentials)
      .pipe(map(
        data => {
          // this.setAuth(data);
          console.log('After login=', JSON.stringify(data));
          return data.accessToken;
        }

      ));
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

}
