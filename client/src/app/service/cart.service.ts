import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private isCartOpen: boolean;
  private isCartOpenListener = new Subject<boolean>();
  constructor( private http: HttpClient ) { }

  getCartStatusListener() {
    return this.isCartOpenListener.asObservable();
  }

  isCartOpenIndicator() {
    this.http.get('http://localhost:3000/cart').subscribe(( cart => {
      if ( cart ) {
        this.isCartOpen = true;
        this.isCartOpenListener.next(true);
      }
    }));
  }
}
