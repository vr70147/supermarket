import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private isCheckoutSecceedListener = new Subject<object>();

  constructor( private http: HttpClient) { }

  getCheckoutSecceedListener() {
    return this.isCheckoutSecceedListener.asObservable();
  }

  sendPayment( city: string, street: string, shippingDate: Date, creditCard: number ) {
    const orderData = {
      city,
      street,
      shippingDate,
      creditCard
    }
    this.http.post<{ status: boolean, message: string }>
    ('http://localhost:3000/order', orderData )
    .subscribe( checkoutRes => {
        return this.isCheckoutSecceedListener.next({ status: checkoutRes.status, message: checkoutRes.message });
    });
  }
}
