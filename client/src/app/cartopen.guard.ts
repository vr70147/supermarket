import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { CartService } from './service/cart.service';

@Injectable()
export class CartOpenGuard implements CanActivate {
  private isCartOpenSub: Subscription;
  indicator: boolean;

  constructor( private cartService: CartService, private router: Router ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
    this.cartService.isCartOpenIndicator();
    this.isCartOpenSub = this.cartService.getCartStatusListener().subscribe(
      (response: boolean ) => {
        console.log(response);
        if ( !response ) {
          this.router.navigate(['/']);
        }
      });
    return false;
  }
}
