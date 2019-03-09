import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../model/product.model';
import { ProductService } from '../service/product.service';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

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

  onSaveProduct( form: NgForm ) {
    console.log(form);
  }

  ngOnDestroy() {
    this.productSub.unsubscribe();
  }
}
