import { Injectable, Inject } from '@angular/core';
import { Product } from '../model/product.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService } from './cart.service';
import { DOCUMENT } from '@angular/common';

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
  private updateProductMessage: string;
  private updateProductMessageListener = new Subject<string>();
  private productsCreatedListener = new Subject<boolean>();

  constructor( private http: HttpClient, private cartService: CartService, @Inject(DOCUMENT) private document: any ) { }

  getUpdateProductMessage() {
    return this.updateProductMessageListener.asObservable();
  }

  getProductUpdateListener() {
    return this.productsUpdated.asObservable();
  }
  isProductCreatedListener() {
    return this.productsCreatedListener.asObservable();
  }

  getEditProductListener() {
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
          price: JSON.parse(product.price),
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

  addProduct( name: string, image: File, price: number, unit: string, category: string ) {
    const productData = new FormData();
    productData.append('name', name);
    productData.append('image', image, name);
    productData.append('price', JSON.stringify(price));
    productData.append('unit', unit);
    productData.append('category', category);
    this.http.post('http://localhost:3000/products', productData).subscribe(( product ) => {
      if ( product ) {
        this.getProducts();
        this.productsCreatedListener.next(true);
      }

    });
  }
  updateProduct( id: string, name: string, image: any, price: number, unit: string, category: string ) {
    console.log(image);
    const productUpdateData = new FormData();
    productUpdateData.append('name', name);
    if ( typeof(image) === 'object' ) {
      productUpdateData.append('image', image, name);
    } else {
      productUpdateData.append('image', image);
    }
    productUpdateData.append('price', JSON.stringify(price));
    productUpdateData.append('unit', unit);
    productUpdateData.append('category', category);
    this.http.patch('http://localhost:3000/products/' + id , productUpdateData )
    .subscribe( ( itemData: any ) => {
      this.updateProductMessage = itemData.message;
      this.updateProductMessageListener.next(this.updateProductMessage);
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
    // tslint:disable-next-line:prefer-for-of
    for ( let i = 0 ; i < this.originalArray.length ; i++ ) {
      if ( this.originalArray[i].category._id === id ) {
        filteredArray.push(this.originalArray[i]);
      }
    }
    this.products = filteredArray;
    this.productsUpdated.next([...this.products]);

  }

  toggleImagePreview(element: HTMLElement) {
    return element.style.display = element.style.display === 'none' || element === undefined  ? 'block' : 'none';
  }
}
