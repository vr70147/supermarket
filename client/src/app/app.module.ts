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
import { ConfirmDialogComponent } from './payment/payment.component';

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
    ConfirmDialogComponent
  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
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
    MatSelectModule
  ],
  exports: [
    ConfirmDialogComponent
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
