import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  data: object = {};
  constructor() { }

  ngOnInit() {
  }
  onSubmitForm(loginForm: NgForm ) {
    if ( loginForm.invalid ) {
      return;
    }
    this.data = {
      user: loginForm.value.email,
      pass: loginForm.value.password
    };
    loginForm.reset();
    console.log(this.data);
  }

}
