import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../model/category.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categories: Category[] = [];
  private categoriesUpdated = new Subject<Category[]>();

  constructor(private http: HttpClient) { }

  getCategoriesUpdateListener() {
    return this.categoriesUpdated.asObservable();
  }

  getCategories() {
    return this.http.get<{categories: Array<any>}>(
      'http://localhost:3000/categories'
    )
    .pipe( map( categoriesData => {
      return categoriesData.categories.map( category => {
        return {
          id: category._id,
          name: category.name
        };
      });
    }))
    .subscribe(transformedCategories => {
      this.categories = transformedCategories;
      this.categoriesUpdated.next([...this.categories]);
    });
  }
}
