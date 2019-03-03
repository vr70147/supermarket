import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product.model';
import { Subscription, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
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
    )
    const url = this.router.url;
    if ( url === '/admin') {
      return this.isCurrentUrl = true;
    }
    this.isCurrentUrl = false;

  }

  addToCart( productValues: Product, qty: HTMLInputElement ) {
    const quantity: string = qty.value;
    const productId: string = productValues.id;
    const data = {
      id: productId,
      qty: quantity
    };
  }

  addToEdit( productValues: Product ) {
    console.log(productValues);
    const product: Product = productValues;
    this.service.addProductToEdit(product);
  }
}
