import { Component, OnInit } from '@angular/core';
import { CartService } from '../service/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  items: Array<any> = [];
  private cartSub: Subscription;
  constructor( private service: CartService ) { }

  ngOnInit() {
    this.service.getCartItems();
    this.cartSub = this.service.getCartItemsListener().subscribe(
      ( ( items: object ) => {
        for ( const key in items ) {
          this.items = items[key];
        }
      })
    );
  }

  getItems() {
    this.service.getCartItems();
  }

}
