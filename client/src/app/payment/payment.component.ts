import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaymentService } from '../service/payment.service';
import { Checkout } from '../model/checkout-response.model';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { CreditCardValidator } from 'angular-cc-library';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  checkoutMessage: string;
  private validCreditCardSub: Subscription;
  validCreditCard = false;
  private checkoutListenerSub: Subscription;

  constructor( private service: PaymentService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.form = new FormGroup({
      city: new FormControl( null, { validators: [Validators.required, Validators.minLength(3)]}),
      street: new FormControl( null, { validators: [Validators.required, Validators.minLength(3)]}),
      shippingDate: new FormControl( null, { validators: [Validators.required]}),
      creditCard: new FormControl( null, { validators: [Validators.required, CreditCardValidator.validateCCNumber]})
    });
  }

  sendCheckout() {
    if ( this.form.invalid ) {
      return;
    }
    this.isLoading = true;
    this.service.sendPayment(
    this.form.value.city,
    this.form.value.street,
    this.form.value.shippingDate,
    this.form.value.creditCard );

    this.service.getCheckoutSecceedListener().subscribe(
    ( response: Checkout ) => {
      if ( response.status ) {
        this.checkoutMessage = response.message;
        this.openDialog();
      }
    });
    this.form.reset();
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open( ModalComponent, {
      width: '30vw',
      data: [this.checkoutMessage, 'סגור וחזור לראשי']
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/']);
      window.location.reload();
    });
  }

}

