import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product.model';
import { Subscription, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  qty: number = 1;
  isCurrentUrl: boolean;
  private productsSub: Subscription;

  constructor( private service: ProductService, private router: Router) { }

  ngOnInit() {
    this.service.getProducts();
    this.productsSub = this.service.getProductUpdateListener().subscribe(
      ( products: Product[]) => {
        this.products = products;
        console.log(this.products)
      }
    );
    const url = this.router.url;
    if ( url === '/admin') {
      return this.isCurrentUrl = true;
    }
    this.isCurrentUrl = false;

  }

  addToCart( product: any, qty: number ) {

    this.qty = qty;
    const productId = product.id;
    const data = {
      id: productId,
      qty: this.qty
    };
    this.service.addProductToCart(data);


  }

  addToEdit( productValues: Product ) {
    const product: Product = productValues;
    this.service.addProductToEdit(product);
  }
ngOnDestroy() {
  this.productsSub.unsubscribe();
}

}
