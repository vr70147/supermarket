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
  private userName: string;
  private userNameListener = new Subject<string>();

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

  getIsUsername() {
    return this.userName;
  }

  getUserNameListener() {
    return this.userNameListener.asObservable();
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
      this.userName = authInfo.username;
      this.userNameListener.next(authInfo.username);
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
    this.http.post<{ token: string, expiresIn: number, name: string }>('http://localhost:3000/users/login', authData )
    .subscribe( response => {
      console.log(response);
      const token = response.token;
      const username = response.name;
      this.token = token;
      if ( token ) {
        const expiredInDuration = response.expiresIn;
        this.setAuthTimer(expiredInDuration);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        const now = new Date();
        this.userName = username;
        this.userNameListener.next(this.userName);
        const expirationDate = new Date( now.getTime() + expiredInDuration * 1000 );
        this.saveAuthData( token, expirationDate, username );

      }

    });
  }
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.router.navigate(['/']);
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }
  private saveAuthData(token: string, expirationDate: Date, name: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('username', name);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('username');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const expirationDate = localStorage.getItem('expiration');
    if ( !token || !expirationDate || !username ) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      username: username
    }
  }
  private setAuthTimer( duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
