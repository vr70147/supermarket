import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Cart } from '../model/cart.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  isCartOpen = false;
  private cart: Cart[] = [];
  private cartItems: object = {};
  private isCartItemsListener = new Subject<object>();
  private isCartOpenListener = new Subject<boolean>();
  private isNewCartListener = new Subject<Cart[]>();
  private isRedirectToCheckoutListener = new Subject<boolean>();

  constructor( private http: HttpClient, private router: Router ) { }

  getCartStatusListener() {
    return this.isCartOpenListener.asObservable();
  }

  getNewCartListener() {
    return this.isNewCartListener.asObservable();
  }
  getCartItemsListener() {
    return this.isCartItemsListener.asObservable();
  }

  isCartOpenIndicator() {
    this.http.get('http://localhost:3000/cart').subscribe(( ( cart: boolean ) => {
        this.isCartOpen = cart;
        this.saveCartStatus(cart);
        this.isCartOpenListener.next(cart);
    }));
  }

  createNewCart( str: object ) {
    this.http.put<{ cart: Array<any> }>('http://localhost:3000/cart', str )
    .pipe( map( cartData => {
      return cartData.cart.map( addedCart => {
        return {
          id: addedCart._id,
          user: addedCart.user,
          date: addedCart.date,
          items: []
        };
      });
    }))
      .subscribe( transformedCart => {
        this.cart = transformedCart;
        this.isNewCartListener.next( [ ...this.cart ] );
        this.router.navigate(['/shopping']);
      });
  }

  getCartItems() {
    this.http.get<{ items: Array<any> }>('http://localhost:3000/cart/products')
    .subscribe( items => {
      this.cartItems = items;
      this.isCartItemsListener.next(items);
    });
  }

  deleteItem(id: string) {
    this.http.delete<{ message: string }>('http://localhost:3000/cart/products/' + id ).subscribe(
      response => {
        this.getCartItems();
      }
    );
  }

  deleteAll() {
    this.http.delete('http://localhost:3000/cart/products').subscribe(
      response => {
        this.getCartItems();
      }
    );
  }

  autoCartStatus() {
    const cartInfo = this.getCartStatus();
    if ( !cartInfo ) {
      return;
    }
    this.isCartOpen = true;
    this.isCartOpenListener.next(true);
  }

  private saveCartStatus(cartStatus: boolean) {
    localStorage.setItem('cartStatus', JSON.stringify(cartStatus));
  }

  private clearCartStatus() {
    localStorage.removeItem('cartStatus');
  }

  private getCartStatus() {
    const cart = localStorage.getItem('cartStatus');
    const parsedCart = JSON.parse(cart);
    if ( !parsedCart ) {
      return;
    }
    return {
      cartStatus: parsedCart
    };
  }
}
