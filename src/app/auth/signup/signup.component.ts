import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Authservice } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  constructor(public authservice : Authservice) { }
  isLoading = false;
  private authStatusSub :Subscription ;
  ngOnInit(): void {
    this.authStatusSub = this.authservice.getAuthStatusListener().subscribe(// incase there is a change in the
      authStatus=>{ // authorization we need to remove the loading circle
        this.isLoading = false;
      }
    )
  }
  onSignUp(form :NgForm){
    if(form.invalid){
      return ;
    }
    this.isLoading = true;
    this.authservice.createUser(form.value.email, form.value.password);

    //console.log(form.value);
  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
