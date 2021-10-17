import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Authservice } from '../auth.service';
import {Subscription} from 'rxjs'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  constructor(public authservice : Authservice) { }
  private authStatusSub :Subscription ;
  ngOnInit(): void {
    this.authStatusSub = this.authservice.getAuthStatusListener().subscribe(// incase there is a change in the
      authStatus=>{ // authorization we need to remove the loading circle
        this.isLoading = false;
      }
    )
  }
  onLogin(form :NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authservice.login(form.value.email,form.value.password);
  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
