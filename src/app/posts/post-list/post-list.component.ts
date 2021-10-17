import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {Post} from '../post.model';
import {PostsService} from '../posts.service'
import {Subscription} from 'rxjs' ;
import { PageEvent } from '@angular/material/paginator';
import { Authservice } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {


  // posts =[
  //   {title: 'First Post', content:'This is first post\'s content. '},
  //   {title: 'Second Post', content:'This is second post\'s content. '},
  //   {title: 'Third Post', content:'This is third post\'s content. '},
  // ];


// without using dependency injection and only using event binding and property binding
 // @Input() posts: Post[]= [] ;
 posts: Post[]= [] ;
 isLoading = false;
 totalPosts = 10;
 postPerPage = 2 ;
 pageSizeOptions = [1,2,5,10];
 currentPage = 1;
  // to cancel the subscription when the object is not in DOM (incase of multiple pages )
  //to prevent memory leak
 private postsSub : Subscription;
 private authStatusSub : Subscription;
 userIsAuthenticated = false;
 userId: string ;


  // without using public
  // postsService:PostsService ;

  // constructor(postsService:Posts) {
  //   this.postsService: postsService;
  // }

  // using public
  constructor(
    public postsService :PostsService,
    private authService : Authservice
    ){

  }
  ngOnInit(): void {
    //this.posts = this.postsService.get_post();
    this.isLoading= true;
    this.postsService.get_posts(this.postPerPage , this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdatedListener()
    .subscribe((postData:{posts:Post[],postCount:number})=>{

      this.posts = postData.posts;
      this.totalPosts = postData.postCount ;
      this.isLoading = false;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();// we are doing this to
    //initialize the value as subscription is only for new values and post-list is only loaded after
    // logging in when we navigate to it and so no new information is passed

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated=>{
        this.userIsAuthenticated = isAuthenticated ;
        this.userId = this.authService.getUserId();
      });


  }
  onChangedPage(pageData : PageEvent){
    //console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex+1;
    this.postPerPage = pageData.pageSize;
    this.postsService.get_posts(this.postPerPage,this.currentPage);
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }
  OnDelete(postId :string){
    this.isLoading = true;
    this.postsService.delete_post(postId).subscribe(()=>{
      this.postsService.get_posts(this.postPerPage,this.currentPage);
    }, ()=>{
      this.isLoading = false;
    });
  }


}
