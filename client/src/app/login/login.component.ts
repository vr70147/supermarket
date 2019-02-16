import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { CartService } from '../service/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userIsAuthenticated = false;
  private authListenerSub: Subscription;
  private cartOpenListenerSub: Subscription;
  constructor( private authService: AuthService, private cartService: CartService ) { }

  ngOnInit() {
  }
  onSubmitForm(loginForm: NgForm ) {
    if ( loginForm.invalid ) {
      return;
    }
    this.authService.login( loginForm.value.email, loginForm.value.password );
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(
      (isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }));
    loginForm.reset();

  }

}
