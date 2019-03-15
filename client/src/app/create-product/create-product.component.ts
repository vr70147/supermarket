import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../model/product.model';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private productSub: Subscription;
  flag = false;
  isLoading = false;
  selects = [
    { unit: 'ליח' },
    { unit: 'ל-100 גרם' },
    { unit: 'לק"ג' }
  ];
  constructor( private service: ProductService) { }

  ngOnInit() {
    this.productSub = this.service.isEditProductListener().subscribe(
      ( product: Product[] ) => {
        this.products = product;
        this.flag = true;
      }
    );
  }

  onSaveProduct( data ) {
    const updatedData = {
        id: data.id,
        name: data.name,
        image: data.image,
        price: data.price,
        unit: data.unit
    }
    this.service.updateProduct(updatedData);
  }

  ngOnDestroy() {
    this.productSub.unsubscribe();
  }
}
