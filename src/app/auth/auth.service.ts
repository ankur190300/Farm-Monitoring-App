import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + "user/";
@Injectable({providedIn:"root"})

export class Authservice {
  constructor(private http:HttpClient, private router: Router){

  }
  private token:string;
  private authStatusListener = new Subject<boolean>(); // whether user is authenticated or not
  private isAuthenticated = false;
  private tokenTimer:any;// timer for logging out the user
  private userId :string ;


  getToken(){
    return this.token ;
  }

  getUserId(){
    return this.userId ;
  }
  getIsAuth(){
    return this.isAuthenticated;
  }
  createUser(email:string , password:string){
    const authdata: AuthData = {email:email, password : password};

    this.http.post( BACKEND_URL+'signup', authdata)
    .subscribe(()=>{
      console.log("HELLO");
      this.router.navigate(["/"]);
    },error=>{
      this.authStatusListener.next(false); // to stop the loading sign
    } );
  }
  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }
  login(email:string , password:string){
    const authdata: AuthData = {email:email, password : password};
    //console.log("HELLO");
    this.http.post<{token:string, expiresIn:number, userId:string}>( BACKEND_URL+'login', authdata)
    .subscribe(response=>{
      const token = response.token;
      this.token = token ;
      if(token){
        const expiresInDuration = response.expiresIn ;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true); // logged in
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration*1000);
        console.log(expirationDate);
        this.saveAuthData(token,expirationDate, response.userId);
        this.router.navigate(['/']);
      }


    }, error=>{
      this.authStatusListener.next(false); // to stop the loading sign
    });
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation) return;
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime(); // gives value in miliseconds
    // getTime() function gives miliseconds that have passed since the java starting(very old) time
    if(expiresIn>0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn/1000); // to convert miliseconds->seconds
      this.authStatusListener.next(true);
    }

  }
  logout(){
    this.token = null ;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/']);// will be executed at the end of the function
    clearTimeout(this.tokenTimer);

  }

  private setAuthTimer(duration:number){
    console.log("Setting timer:"+duration);
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    }, duration*1000);
  }
  // private because will only be called inside the class itself
  private saveAuthData(token:string , expirationDate:Date, userId:string){
    // localStorage to access the local storage on this device
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());// can't save as date object therefore
    //converted to serialized and standarized version of the string
    localStorage.setItem('userId',userId );


  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData(){
    const token = localStorage.getItem('token') ;
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if(!token || !expirationDate){
      return;
    }
    return {
      token:token,
      expirationDate:new Date(expirationDate),
      userId:userId
    }
  }
}
