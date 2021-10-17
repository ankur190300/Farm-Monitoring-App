import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Authservice } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private AuthListenerSubs :Subscription ;
  userIsAuthenticated = false;
  constructor(private authService : Authservice) { }

  ngOnInit(): void {

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.AuthListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated =>{

      this.userIsAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy(): void {
    this.AuthListenerSubs.unsubscribe();
  }

  onLogout(){
    this.authService.logout();
  }
}
