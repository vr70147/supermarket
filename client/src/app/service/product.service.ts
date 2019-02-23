import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  private productsUpdated = new Subject<Product[]>();

  constructor( private http: HttpClient ) { }

  getProducts() {
    return this.http.get< {products: Array<any>}>(
      'http://localhost:3000/products'
    ).pipe( map( productsData => {
      return productsData.products.map( product => {
        return {
          id: product._id,
          name: product.name,
          image: product.image,
          price: product.price
        };
      });
    }))
    .subscribe(transformedProducts => {
      this.products = transformedProducts;
      this.productsUpdated.next([...this.products]);
    });
  }

  getProductUpdateListener() {
    return this.productsUpdated.asObservable();
  }


}
