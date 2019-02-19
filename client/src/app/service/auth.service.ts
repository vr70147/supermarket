import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Signup } from '../model/signup.model';
import { Login } from '../model/login.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  constructor( private http: HttpClient, private router: Router ) { }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser( authData: Signup ) {
    this.http.post('http://localhost:3000/users/signup', authData )
    .subscribe( userData => {
      console.log(userData);
    });
  }
  login( email: string, password: string ) {
    const authData: Login = { email, password };
    this.http.post<{ token: string }>('http://localhost:3000/users/login', authData )
    .subscribe( response => {
      const token = response.token;
      this.token = token;
      if ( token ) {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
      }

    });
  }
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
  }
}
