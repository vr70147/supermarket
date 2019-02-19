import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ShoppingPageComponent } from './shopping-page/shopping-page.component';
import { SignupComponent } from './signup/signup.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { AuthGuard } from './auth.guard';
import { CheckoutComponent } from './checkout/checkout.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'shopping', component: ShoppingPageComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'admin', component: CreateProductComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
