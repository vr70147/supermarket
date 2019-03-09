import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { CartService } from '../service/cart.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userIsAuthenticated = false;
  private authListenerSub: Subscription;
  private cartListenerSub: Subscription;
  private newCartListenerSub: Subscription;
  isCartOpen = false;
  isLoading = false;
  isError = false;
  constructor( private authService: AuthService, private cartService: CartService, private router: Router ) { }

  ngOnInit() {
    this.isLoading = false;
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(
      ( isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }));
    if ( this.userIsAuthenticated ) {
      this.cartService.isCartOpenIndicator();
      this.cartListenerSub = this.cartService.getCartStatusListener().subscribe(
        ( response: boolean ) => {
          this.isCartOpen = response;
        }
      );
    }

  }
  onSubmitForm(loginForm: NgForm ) {
    if ( loginForm.invalid ) {
      return ;
    }
    this.isLoading = true;
    this.authService.login( loginForm.value.email, loginForm.value.password );
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(
      (isAuthenticated => {
        if ( !isAuthenticated ) {
          this.isLoading = false;
          return this.isError = true;
        }
        this.cartService.isCartOpenIndicator();
        this.userIsAuthenticated = isAuthenticated;
        this.isLoading = false;
      }));
    this.cartListenerSub = this.cartService.getCartStatusListener().subscribe(
      ( response: boolean ) => {
        this.isCartOpen = response;
      }
    );
    loginForm.reset();
  }

  createCart() {
    const nothing = { noValue: ''};
    this.cartService.createNewCart( nothing );
  }
  continueShopping() {
    this.router.navigate(['/shopping']);
  }
}
