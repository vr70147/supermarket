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
  private editProduct = [];
  private editProductListener = new Subject<Product[]>();

  constructor( private http: HttpClient ) { }

  getProductUpdateListener() {
    return this.productsUpdated.asObservable();
  }

  isEditProductListener() {
    return this.editProductListener.asObservable();
  }

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

  addProductToCart() {

  }

  addProductToEdit( product: object ) {
 // tslint:disable-next-line:forin
    let obj = {}
    for ( const key in product ) {
      obj[key] = product[key];
    }
    this.editProduct.push(obj);
    this.editProductListener.next(this.editProduct);
  }




}
