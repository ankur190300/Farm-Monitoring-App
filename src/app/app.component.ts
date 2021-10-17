import { Component, OnInit } from '@angular/core';
import { Authservice } from './auth/auth.service';

// without using dependency injection and only using event binding and property binding
//import {Post} from './posts/post.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mean-udemy';
  constructor(private authservice : Authservice){}

  ngOnInit(){
    this.authservice.autoAuthUser(); // placing it here because app.components
    //loads first everytime application starts
  }

  // without using dependency injection and only using event binding and property binding
  //import {Post} from './posts/post.model';
  // stored_posts :Post[]= [];
  // onPostAdded(post){
  //   // this.stored_posts.push(3); // this would give error as 3 is not a post
  //   this.stored_posts.push(post);
  // }
}
