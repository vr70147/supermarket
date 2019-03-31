import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product.model';
import { Subscription, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { stringify } from '@angular/core/src/util';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Array<any>;
  cartItems: Array<any> = [];
  qty: number;
  isCurrentUrl: boolean;
  private cartItemsListener = new Subject<Array<any>>();
  private productsSub: Subscription;
  private cartItemsSub: Subscription;

  constructor( private service: ProductService, private router: Router) { }

  ngOnInit() {
    this.service.getProducts();
    this.productsSub = this.service.getProductUpdateListener().subscribe(
      ( products: Product[]) => {
        this.products = products;
        this.assignCopy();
      }
    );
    const url = this.router.url;
    if ( url === '/admin') {
      return this.isCurrentUrl = true;
    }
    this.isCurrentUrl = false;

  }

  changeQty( event: Event ) {
    this.qty = JSON.parse((event.target as HTMLInputElement).value);
  }

 filterProduct( value: string ) {
    if ( !value ) {
      return this.assignCopy();
    }
    this.filteredProducts = Object.assign([], this.products).filter(
       product => product.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
}

  getCartItems() {
    return this.cartItemsListener.asObservable();
  }

  addToCart( product: any, qty: number ) {
    this.qty = qty;
    const productId = product.id;
    const data = {
      id: productId,
      qty: this.qty
    };
    this.service.addProductToCart(data);
    this.cartItemsSub = this.service.getAddedProductInCart().subscribe(
      ( items: Array<any> ) => {
        this.cartItems = items;
        this.cartItemsListener.next(this.cartItems);
      }
    );
  }

  addToEdit( productValues: Product ) {
    const product: Product = productValues;
    this.service.addProductToEdit(product);
  }

  private assignCopy() {
    this.filteredProducts = Object.assign([], this.products);
  }
  ngOnDestroy() {
    this.productsSub.unsubscribe();
    if ( this.cartItems.length < 0 ) {
      this.cartItemsSub.unsubscribe();
    }
  }
}
