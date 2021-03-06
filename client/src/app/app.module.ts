import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AdvertiseComponent } from './advertise/advertise.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CartComponent } from './cart/cart.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule,
         MatFormFieldModule,
         MatIconModule,
         MatDialogModule,
         MatInputModule,
         MatCardModule,
         MatButtonModule,
         MatProgressSpinnerModule,
         MatSelectModule,
         MatExpansionModule} from '@angular/material';
import { HomepageComponent } from './homepage/homepage.component';
import { ShoppingPageComponent } from './shopping-page/shopping-page.component';
import { AdminComponent } from './admin/admin.component';
import { AuthInterceptor } from './auth-interceptor';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentComponent } from './payment/payment.component';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { ModalComponent } from './modal/modal.component';
import { NgHighlightModule } from 'ngx-text-highlight';
import { HighlightSearch } from './cart/cart.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    AdvertiseComponent,
    NotificationsComponent,
    CartComponent,
    ProductsComponent,
    CategoriesComponent,
    CreateProductComponent,
    HomepageComponent,
    ShoppingPageComponent,
    AdminComponent,
    CheckoutComponent,
    PaymentComponent,
    ModalComponent,
    HighlightSearch
  ],
  entryComponents: [
    ModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CreditCardDirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    NgHighlightModule
  ],
  exports: [
    ModalComponent
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
