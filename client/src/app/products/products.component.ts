import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  private productsSub: Subscription;

  constructor( private service: ProductService) { }

  ngOnInit() {
    this.service.getProducts();
    this.productsSub = this.service.getProductUpdateListener().subscribe(
      ( products: Product[]) => {
        console.log(products)
        this.products = products;
      }
    )
  }

  addToCart( productValues: Product, qty: HTMLInputElement ) {
    const quantity: string = qty.value;
    const productId: string = productValues.id;
    const data = {
      id: productId,
      qty: quantity
    };


  }

}
