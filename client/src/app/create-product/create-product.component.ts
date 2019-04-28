import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../model/product.model';
import { ProductService } from '../service/product.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from './mime-type.validator';
import { CategoryService } from '../service/category.service';
import { Category } from '../model/category.model';
import { MatDialog } from '@angular/material';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit, OnDestroy {
  productId: string;
  selectedUnit: string;
  selectedCategory: string;
  element: HTMLElement;
  private productSub: Subscription;
  private categorySub: Subscription;
  mode = 'create';
  buttonMode = 'צור מוצר חדש';
  isString = false;
  form: FormGroup;
  imagePreview: string;
  isLoading = false;
  selects = [
    { unit: 'ליח' },
    { unit: 'ל-100 גרם' },
    { unit: 'לק"ג' }
  ];
  categories: Category[] = [];

  constructor( private service: ProductService, private categoryService: CategoryService, public dialog: MatDialog ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl( null, { validators: [Validators.required, Validators.minLength(3)]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [ mimeType ]}),
      price: new FormControl( null, { validators: [Validators.required]}),
      unit: new FormControl( null, { validators: [Validators.required]}),
      category: new FormControl( null, { validators: [Validators.required] })
  });
    this.categorySub = this.categoryService.getCategoriesUpdateListener().subscribe(
      ( category: Category[] ) => {
        this.categories = category;
      }
    );
    this.productSub = this.service.getEditProductListener().subscribe(
      ( product: any ) => {
        this.selectedCategory = product[0].category._id;
        this.selectedUnit = product[0].unit;
        this.form.setValue({
          name: product[0].name,
          image: product[0].image,
          price: product[0].price,
          unit: this.selectedUnit,
          category: this.selectedCategory
        });
        this.imagePreview = product[0].image;
        if ( this.imagePreview.length > 0 ) {
          this.isString = true;
        }
        this.productId = product[0].id;
        this.mode = 'edit';
        this.buttonMode = 'עדכן מוצר';
      }
    );
  }
  onImagePicked( event: Event ) {
    // Get image file and display it in the DOM

    const file = ( event.target as HTMLInputElement ).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    if ( this.element !== undefined ) {
      this.element.style.display = 'block';
    }
  }

  onSaveProduct() {
    // Send request to server to create new product or edit one

   if ( this.form.invalid && this.selectedCategory === undefined && this.selectedUnit === undefined ) {
     return;
   }
   this.isLoading = true;
   if ( this.mode === 'create' ) {
      this.service.addProduct(
      this.form.value.name,
      this.form.value.image,
      this.form.value.price,
      this.selectedUnit,
      this.selectedCategory );
      this.service.isProductCreatedListener().subscribe(( response: boolean ) => {
        if ( response ) {
          this.imagePreview = null;
          this.isLoading = false;
        }
      });
   } else {
    this.service.updateProduct(
      this.productId,
      this.form.value.name,
      this.form.value.image,
      this.form.value.price,
      this.selectedUnit,
      this.selectedCategory
     );
    this.openDialog();
  }
   this.form.reset();
   this.selectedCategory = '';
   this.selectedUnit = '';
  }

  updateSelectedCategory( id: string ) {
    this.selectedCategory = id;
  }
  updateSelectedUnit( unit: string ) {
    this.selectedUnit = unit;
  }
  changeToNewProduct() {
    this.mode = 'create';
    this.form.reset();
    this.selectedCategory = '';
    this.selectedUnit = '';
    this.element = document.getElementById('imagePreview');
    this.element.style.display = this.service.toggleImagePreview(this.element);
  }
  private openDialog(): void {
    const dialogRef = this.dialog.open( ModalComponent, {
      width: '20vw',
      data: ['המוצר עודכן בהצלחה', 'סגור']
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }
  ngOnDestroy() {
    this.productSub.unsubscribe();
    this.categorySub.unsubscribe();
  }
}
