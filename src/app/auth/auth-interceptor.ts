import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authservice } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

  constructor(private authservice :Authservice){}
  intercept(req:HttpRequest<any> , next:HttpHandler){
    const authToken = this.authservice.getToken();

    const authRequest = req.clone({ // request needs to be cloned and can't be edited directly
      headers : req.headers.set("Authorization", "Bearer " +authToken)// Bearer is the convention
      //                                                               "Authorization" here is case insensitive
      //                                                               it overwrites the existing
      //                                                               authorization header if it exists
    })


    return next.handle(authRequest); // this sends the request forward after modifying it
  }

}
