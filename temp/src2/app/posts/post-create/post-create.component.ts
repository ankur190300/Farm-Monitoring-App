import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  constructor() { }
  new_post = "no content";
  ngOnInit(): void {

  }

  onAddPost(){
    this.new_post= this.entered_text_post;

  }

}
