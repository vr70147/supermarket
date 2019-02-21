import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  isCartOpen = false;
  private isCartOpenListener = new Subject<boolean>();
  constructor( private http: HttpClient ) { }

  getCartStatusListener() {
    return this.isCartOpenListener.asObservable();
  }

  isCartOpenIndicator() {
    this.http.get('http://localhost:3000/cart').subscribe(( ( cart: boolean ) => {
        this.isCartOpen = cart;
        this.saveCartStatus(cart);
        this.isCartOpenListener.next(cart);
    }));
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
