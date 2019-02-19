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
        this.isCartOpenListener.next(cart);
    }));
  }
}
