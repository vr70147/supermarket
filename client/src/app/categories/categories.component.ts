import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from '../service/category.service';
import { ProductService } from '../service/product.service';
import { Subscription } from 'rxjs';
import { Category } from '../model/category.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  private categoriesSub: Subscription;

  constructor(private categoryservice: CategoryService, private productService: ProductService ) { }

  ngOnInit() {
    this.categoryservice.getCategories();
    this.categoriesSub = this.categoryservice.getCategoriesUpdateListener().subscribe(
      ( categories: Category[]) => {
        this.categories = categories;
      });
  }

  filterProduct( id: string ) {
    this.productService.filterByCategory(id);
  }

  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
  }

}
