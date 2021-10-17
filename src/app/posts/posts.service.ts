import {Post} from './post.model'
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Subject} from 'rxjs' ;
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + "posts/";
@Injectable ({providedIn:'root'})

export class PostsService{
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts:Post[], postCount:number}>(); // to inform the other components whenever new post is added
  constructor(private http:HttpClient, private router:Router){};
  // without using http module
  // get_post(){
  //   return [...this.posts];
  // }
  get_posts(postsPerPage:number, currentPage:number){
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.http.get<{message: string , posts: any, totalPosts:number}>( // instead of 'any'- Post[] this.http.get<{message: string , posts: Post[]}>(
      BACKEND_URL+queryParams
      )
    .pipe(map((postData)=>{ // this is done to convert _id in backend to id in front end
      return {
        posts:postData.posts.map(post=>{
        return {
          title : post.title ,
          content :post.content ,
          id : post._id,
          imagePath:post.imagePath,
          creator: post.creator
        };
      }), totalPosts :postData.totalPosts };
    }))
    .subscribe(transformed_posts=>{
      //console.log(transformed_posts);
        this.posts = transformed_posts.posts;
        this.postsUpdated.next({
          posts:[...this.posts],
          postCount:transformed_posts.totalPosts
        }); //... is used to make copy of an object

    });

  }
  getPost(id:string){
    // wihtout taking the new post from web
    //return { ...this.posts.find(p=> p.id === id)}// === is a strict version of == which also checks data type
    return this.http.get<{_id:string , title:string , content:string, imagePath:string , creator:string}>
    (BACKEND_URL + id);
  }
  getPostUpdatedListener(){
    return this.postsUpdated.asObservable();// using observable to get the post list real time i.e.
                                            //tell the other components whenever there is a change in the posts
  }
  add_post(title:string , content:string, image:File){
    // method to send post title and content using json to the backend , but we can't use json to send file
    // to the backend
    //const post : Post = { id:null, title:title , content:content};


    // to send the image file we will use the formData()
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    //console.log("YO");
    //console.log(title);
    //console.log(content);
    //console.log()
    this.http.post<{message : string , post : Post }>(BACKEND_URL,postData)//  post)
    .subscribe((responseData)=>{
        //console.log(responseData.message);


        // not needed , this was only for the purpose of understanding
        /*
        const post : Post = {
          id:responseData.post.id,
          title:title ,
          content:content,
          imagePath:responseData.post.imagePath};
        //const new_id = responseData.postId;
        //post.id = new_id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]); // our subject is emitting this post list
        */
       // till here it was unnecessary , was just needed for the purpose of learning , as post-list component
       // would anyway call for the new lists from the backend

        this.router.navigate(["/"]); // navigate to home page
    })

  }

  delete_post(postId:string){
    //console.log(postId);
    // not needed , this was only for the purpose of understanding
    /*this.http.delete("http://localhost:3000/api/posts/" + postId)
    .subscribe(()=>{
      const updatedPosts = this.posts.filter(post=> post.id!= postId);// to show the posts after deleting one in real time
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);

    });*/
    // till here it was unnecessary , was just needed for the purpose of learning , as post-list component
    // would anyway call for the new lists from the backend

    return this.http.delete(BACKEND_URL + postId) ; // it now becomes an observable
  };

  updatePost(id:string , title:string , content : string, image:File|string ){
    //const post:Post = { id:id , title :title , content:content, imagePath:null};
    let postData : Post|FormData ;
    if(typeof image=="object"){ // checks if image is a File
       postData = new FormData();
       postData.append("id", id);
       postData.append("title", title);
       postData.append("conent", content);
       postData.append("image", image, title);

    }
    else{ // if image is a string
      postData = {
        id:id,
        title:title,
        content:content,
        imagePath:image,
        creator:null
      }
    }
    this.http
    .put(BACKEND_URL + id,  postData)
    .subscribe((response)=>{
      // not needed , this was only for the purpose of understanding


      // const updatedPosts = [...this.posts];
      // const target_index = updatedPosts.findIndex(p=>p.id== id);
      // const post:Post = {
      //   id:id,
      //   title:title ,
      //   content : content ,
      //   imagePath:"" //response.imagePath
      // }
      // updatedPosts[target_index] = post;
      // this.posts = updatedPosts;
      // this.postsUpdated.next([...this.posts]);

      // till here it was unnecessary , was just needed for the purpose of learning , as post-list component
    // would anyway call for the new lists from the backend
      this.router.navigate(["/"]);
    })
  }

}
