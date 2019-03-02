import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userName = '';
  private authListenerSub: Subscription;
  private userNameListenerSub: Subscription;
  constructor( private authService: AuthService ) { }

  onLogout() {
    this.authService.logout();
  }
  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(
      (isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      })
    );
    this.userName = this.authService.getIsUsername();
    this.userNameListenerSub = this.authService.getUserNameListener().subscribe(
      ( name: string ) => {
        this.userName = name;
      }
    )
  }
  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }
}
