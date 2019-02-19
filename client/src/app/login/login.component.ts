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
  private cartListenerSub: Subscription;
  isCartOpen = false;
  isLoading = false;
  constructor( private authService: AuthService, private cartService: CartService ) { }

  ngOnInit() {
    this.isLoading = false;
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(
      ( isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }));
  }
  onSubmitForm(loginForm: NgForm ) {
    if ( loginForm.invalid ) {
      return;
    }
    this.isLoading = true;
    this.authService.login( loginForm.value.email, loginForm.value.password );
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(
      (isAuthenticated => {
        this.cartService.isCartOpenIndicator();
        this.userIsAuthenticated = isAuthenticated;
      }));
    this.cartListenerSub = this.cartService.getCartStatusListener().subscribe(
      ( response: boolean ) => {
        this.isCartOpen = response;
      }
    );
    loginForm.reset();

  }
}
