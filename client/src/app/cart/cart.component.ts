import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../service/cart.service';
import { Subscription, Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { Pipe, PipeTransform } from '@angular/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightSearch implements PipeTransform {
constructor(private sanitizer: DomSanitizer) {}

  transform(textValue: any, args: any): any {
    if (!args) {
      return textValue;
    }
    // Match in a case insensitive maneer
    const re = new RegExp(args, 'gi');
    const match = textValue.match(re);

    // If there's no match, just return the original value.
    if (!match) {
      return textValue;
    }

    // const value = textValue.replace(re, '<mark>' + match[0] + '</mark>');
    const value =  args ? textValue.replace(new RegExp(args, 'i'), `<mark>${args}</mark>`) : textValue;
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit, OnDestroy {
  items: Array<any> = [];
  total = 0;
  mode = 'shopping';
  private cartSub: Subscription;
  results: string[];
  searchTerm: string;

  constructor( private service: CartService, private router: Router, public dialog: MatDialog, private sanitizer: DomSanitizer ) { }

   ngOnInit() {
    if ( this.router.url === '/checkout') {
      this.mode = 'checkout';
    }
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
  updateSearch(e: any) {
    this.searchTerm = e.target.value;
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
      return this.openDialog();
    }
    this.router.navigate(['checkout']);
  }

  getTotal() {
    const total = [];
    // tslint:disable-next-line:prefer-for-of
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

  private openDialog(): void {
    const dialogRef = this.dialog.open( ModalComponent, {
      width: '20vw',
      data: ['סכום ההזמנה המינימלי למשלוח הוא ₪200', 'סגור']
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnDestroy() {
    this.cartSub.unsubscribe();
  }

}
