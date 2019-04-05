import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  constructor( private service: AuthService ) { }

  ngOnInit() {
  }
  onSubmitForm(signUpForm: NgForm ) {
    if ( signUpForm.invalid ) {
      return;
    }
    const data = {
      email: signUpForm.value.email,
      password: signUpForm.value.password,
      city: signUpForm.value.city,
      street: signUpForm.value.street,
      fname: signUpForm.value.fname,
      lname: signUpForm.value.lname,
      role: 'customer'
    };
    this.service.createUser( data );
    signUpForm.reset();
  }

}
