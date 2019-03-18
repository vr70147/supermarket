import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../model/product.model';
import { ProductService } from '../service/product.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from './mime-type.validator';
import { CategoryService } from '../service/category.service';
import { Category } from '../model/category.model';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit, OnDestroy {
  products: Product;
  private productSub: Subscription;
  private categorySub: Subscription;
  private mode = 'create';
  form: FormGroup;
  imagePreview: string;
  isLoading = false;
  selects = [
    { unit: 'ליח' },
    { unit: 'ל-100 גרם' },
    { unit: 'לק"ג' }
  ];
  categories: Category[] = [];

  constructor( private service: ProductService, private categoryService: CategoryService ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl( null, { validators: [Validators.required, Validators.minLength(3)]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [ mimeType ]}),
      price: new FormControl( null, { validators: [Validators.required]}),
      unit: new FormControl( null, { validators: [Validators.required]}),
      category: new FormControl( null, { validators: [Validators.required]})
  });
    this.categorySub = this.categoryService.getCategoriesUpdateListener().subscribe(
      ( category: Category[] ) => {
        this.categories = category;
      }
    )
    this.productSub = this.service.isEditProductListener().subscribe(
      ( product: any ) => {
        this.products = {
          id: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          unit: product.unit,
          category: product.category
        };

        this.form.setValue({
          id: this.products.id,
          name: this.products.name,
          image: this.products.image,
          price: this.products.price,
          unit: this.products.unit,
          category: this.products.category
        });

        this.mode = 'edit';
      }
    );
  }

  onSaveProduct() {
   if ( this.form.invalid ) {
     return;
   }
   this.isLoading = true;
   if ( this.mode === 'create' ) {
     this.service.addProduct(
      this.form.value.name,
      this.form.value.image,
      this.form.value.price,
      this.form.value.unit,
      this.form.value.category );
   } else {
     this.service.updateProduct(
      this.form.value.id,
      this.form.value.name,
      this.form.value.image,
      this.form.value.price,
      this.form.value.unit,
      this.form.value.category
     );
   }
   this.form.reset();
  }
  onImagePicked( event: Event ) {
    const file = ( event.target as HTMLInputElement ).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.productSub.unsubscribe();
  }
}
