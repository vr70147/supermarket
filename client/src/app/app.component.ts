import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { CartService } from './service/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor( private authService: AuthService ) {}

  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
