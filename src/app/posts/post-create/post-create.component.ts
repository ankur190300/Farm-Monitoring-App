import { Component, OnInit , EventEmitter, Output, OnDestroy} from '@angular/core';
import {Post} from '../post.model';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms'
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';// gives important info about the router that we are on
import {mimeType} from './mime-type.validator';
import { Subscription } from 'rxjs';
import { Authservice } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit , OnDestroy{

  constructor(
    public postsService : PostsService ,
    public route : ActivatedRoute,
    private authService:Authservice
    )
    { }


  entered_content = "";
  entered_text = "" ;
  isLoading = false;
  post : Post ; // should not be private as will be accessed outside the class
  form :FormGroup ; // using the reactive approach
  imagePreview : string ;
  private mode = "create";
  private postId :string ;
  private authStatusSub: Subscription ;
  ngOnInit(): void {

    this.authStatusSub= this.authService.getAuthStatusListener().subscribe(
      authstatus=>{
        this.isLoading = false;
      }
    );
    // reactive form
    this.form = new FormGroup({
      'title': new FormControl(null,{
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null,{
        validators: [Validators.required]
      }),
      'image':new FormControl(null,{
        validators: [Validators.required],
        asyncValidators:[mimeType]
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap)=>{  // subscribe function is called whenever the parameters change
      if(paramMap.has("postId")){
        this.mode = "edit" ;
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        //this.post = this.postsService.getPost(this.postId);
        this.postsService.getPost(this.postId).subscribe(postData=>{
          this.isLoading= false;
          this.post = {
            id:postData._id,
            title:postData.title ,
            content:postData.content,
            imagePath:postData.imagePath,
            creator:postData.creator
          };
          // reactive form approach
          this.form.setValue({
            title:this.post.title,
            content:this.post.content,
            image:this.post.imagePath
          });
        });
      }
      else {this.mode = "create"; this.postId = null; }
    })
  }


  // without using dependency injection and only using event binding and property binding
  //@Output() postCreated = new EventEmitter<Post>(); // output to the parent component



  // without using ngForm
  // onAddPost(){
  //   const post:Post = {
  //     title: this.entered_text,
  //     content:this.entered_content
  //   };
  //   this.postCreated.emit(post);
  // }


  // not using reactive forms only using forms
  //onSavePost( form :NgForm){  // saves the hard work of two way binding
  onSavePost(){
    if(this.form.invalid){ // using this.form.invalid instead of form.invalid in reactive form
      return ;
    }

    // without using dependency injection and only using event binding and property binding
    // const post:Post = {
    //   title: form.value.title,
    //   content:form.value.content
    // };
    //this.postCreated.emit(post);
    this.isLoading = true;
    if(this.mode == "create"){
      this.postsService.add_post(this.form.value.title, this.form.value.content, this.form.value.image);
      // using this.form.value.title,this.form.value.content instead of form.value.title in reactive form
    }
    else{
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image);
      // using this.form.value.title,this.form.value.content instead of form.value.title in reactive form
    }

    //form.resetForm(); // when not using reactive form
    this.form.reset();
  }

  onImagePicked(event:Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file}); // unlike set_value patchValue is used to set only one value
    this.form.get('image').updateValueAndValidity(); // check for the validity if the file is image or not
    // console.log(file);
    // console.log(this.form);
    const reader = new FileReader();
    reader.onload = ()=>{
      this.imagePreview = reader.result as string ;
    };
    reader.readAsDataURL(file);

  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
