import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../model/product.model';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  products: Product[] = [];
  random: Array<any> = [];
  randomStatus = false;
  totalProducts: number;
  productSub: Subscription;
  constructor( private service: ProductService ) { }

  ngOnInit() {

    this.service.getProducts();
    this.productSub = this.service.getProductUpdateListener()
    .subscribe( (product: Product[]) => {
      const mathRandom = Math.floor(Math.random() * product.length);
      this.products = product;
      this.random.push(product[Math.floor(mathRandom)].image);
      this.random.push(product[Math.floor(mathRandom)].name);
      this.random.push(product[Math.floor(mathRandom)].price);
      this.totalProducts = product.length;
      if ( this.random.length > 0 ) {
        this.randomStatus = true;
      }
    });
  }
}
