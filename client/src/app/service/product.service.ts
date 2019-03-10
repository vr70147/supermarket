import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  originalArray: Product[] = [];
  addedProductInCart: Array<any> = [];
  private addedProductInCartListener = new Subject<Array<any>>();
  private productsUpdated = new Subject<Product[]>();
  private editProduct = [];
  private editProductListener = new Subject<Product[]>();


  constructor( private http: HttpClient, private cartService: CartService ) { }

  getProductUpdateListener() {
    return this.productsUpdated.asObservable();
  }

  isEditProductListener() {
    return this.editProductListener.asObservable();
  }

  getAddedProductInCart() {
    return this.addedProductInCartListener.asObservable();
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
          price: product.price,
          unit: product.unit,
          category: product.category
        };
      });
    }))
    .subscribe(transformedProducts => {
      this.products = transformedProducts;
      this.originalArray = transformedProducts;
      this.productsUpdated.next([...this.products]);
    });
  }

  addProductToCart(productData) {
    this.http.put('http://localhost:3000/cart/products', productData )
    .subscribe( ( itemData: object ) => {
      this.cartService.getCartItems();
    });
  }

  addProductToEdit( product: object ) {
    this.editProduct = [];

    const obj = {};
    // tslint:disable-next-line:forin
    for ( const key in product ) {
      obj[key] = product[key];
    }
    this.editProduct.push(obj);
    this.editProductListener.next(this.editProduct);
  }

  filterByCategory( id: string ) {
    const filteredArray = [];
    if ( id === '5c8405661c9d44000079f46e') {
      this.productsUpdated.next([...this.originalArray]);
      return;
    }
    for ( let i = 0 ; i < this.originalArray.length ; i++ ) {
      if ( this.originalArray[i].category._id === id ) {
        filteredArray.push(this.originalArray[i]);
      }
    }
    console.log(filteredArray)
    this.products = filteredArray;
    this.productsUpdated.next([...this.products]);

  }




}
