import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private isCheckoutSecceedListener = new Subject<object>();
  private isValidCreditCardListener = new Subject<boolean>();
  validCreditCard: boolean;
  constructor( private http: HttpClient) { }

  getCheckoutSecceedListener() {
    return this.isCheckoutSecceedListener.asObservable();
  }

  getValidCreditCardListener() {
    return this.isValidCreditCardListener.asObservable();
  }

  sendPayment( city: string, street: string, shippingDate: Date, creditCard: number ) {
    this.isValidCreditCard(creditCard);
    if ( this.validCreditCard ) {
      const orderData = {
        city,
        street,
        shippingDate,
        creditCard
      };
      this.http.post<{ status: boolean, message: string }>
      ('http://localhost:3000/order', orderData )
      .subscribe( checkoutRes => {
          return this.isCheckoutSecceedListener.next({ status: checkoutRes.status, message: checkoutRes.message });
      });
    }
    return this.isValidCreditCardListener.next(false);
  }

  private isValidCreditCard( creditCard: number ) {
    // Regex Types
    const stringifyCreditCard = JSON.stringify(creditCard);
    const visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    const mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
    const amexpRegEx = /^(?:3[47][0-9]{13})$/;
    const discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;

    if (visaRegEx.test(stringifyCreditCard) ||
        mastercardRegEx.test(stringifyCreditCard) ||
        amexpRegEx.test(stringifyCreditCard) ||
        discovRegEx.test(stringifyCreditCard)) {
      return this.validCreditCard = true;
    }
    return this.validCreditCard = false;
  }
}
