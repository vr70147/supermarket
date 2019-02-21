import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Signup } from '../model/signup.model';
import { Login } from '../model/login.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  isAuthenticated = false;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor( private http: HttpClient, private router: Router, private cartService: CartService ) { }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if ( !authInfo ) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if ( expiresIn > 0 ) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  createUser( authData: Signup ) {
    this.http.post('http://localhost:3000/users/signup', authData )
    .subscribe( userData => {
      console.log(userData);
    });
  }
  login( email: string, password: string ) {
    const authData: Login = { email, password };
    this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/users/login', authData )
    .subscribe( response => {
      const token = response.token;
      this.token = token;
      if ( token ) {
        const expiredInDuration = response.expiresIn;
        this.setAuthTimer(expiredInDuration);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date( now.getTime() + expiredInDuration * 1000 );
        this.saveAuthData( token, expirationDate );
      }

    });
  }
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
  }
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if ( !token || !expirationDate ) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
  private setAuthTimer( duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
