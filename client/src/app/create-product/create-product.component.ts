import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../model/product.model';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  products: Product[] = [];
  private productSub: Subscription;
  flag = false;
  isLoading = false;

  constructor( private service: ProductService) { }

  ngOnInit() {
    this.productSub = this.service.isEditProductListener().subscribe(
      ( product: Product[] ) => {
        this.products = product;
        this.flag = true;
      }
    );
  }

  onSaveProduct( event: Event ) {

  }
}
