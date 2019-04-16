import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ShoppingPageComponent } from './shopping-page/shopping-page.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './auth.guard';
import { CartOpenGuard } from './cartopen.guard';
import { CheckoutComponent } from './checkout/checkout.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'shopping', component: ShoppingPageComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, CartOpenGuard]
})
export class AppRoutingModule { }
