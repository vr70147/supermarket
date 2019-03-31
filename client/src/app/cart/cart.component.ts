import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../service/cart.service';
import { Subscription, Subject } from 'rxjs';
import { throwToolbarMixedModesError } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  items: Array<any> = [];
  total = 0;
  private cartSub: Subscription;
  private cartUpdatedSub: Subscription;

  constructor( private service: CartService, private router: Router ) { }

   ngOnInit() {
    this.service.getCartItems();
    this.cartSub = this.service.getCartItemsListener().subscribe(
      ( async ( items: object ) => {
        // tslint:disable-next-line:forin
        for ( const key in items ) {
          this.items = await items[key];
        }
        await this.getTotal();
      })
    );
  }

  getItems() {
    this.service.getCartItems();
  }

  deleteCartItems( id: string ) {
    this.service.deleteItem(id);
  }

  deleteAllCartItems() {
    this.service.deleteAll();
  }

  continueToOrder() {
    if ( this.total < 200 ) {
      return;
    }
    this.router.navigate(['checkout']);
  }

  getTotal() {
    const total = [];
    for ( let i = 0 ; i < this.items.length ; i++ ) {
      total.push( this.items[i].price * this.items[i].qty );
    }
    if ( total.length === 0 ) {
      return;
    }
    const getSum = ( totalNums: number, num: number ) => {
      return totalNums + num;
    };
    this.total = total.reduce(getSum);
  }

  ngOnDestroy() {
    this.cartSub.unsubscribe();
  }

}
