import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms'; // in this we only used the template
//import {ReactiveFormsModule} from '@angular/forms'; // with this as opposed to above we
//                                                    define our own methods in typescript
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import {ErrorInterceptor} from './error-interceptor';
import { ErrorComponent } from './error/error.component' ;
import {AngularMaterialModule} from './angular-material.module';
import {PostsModule} from './posts/posts.module';
import {AuthModule} from './auth/auth.module';
import { FarmCallComponent } from './farm-call/farm-call.component';
import {MatTableModule} from '@angular/material/table';
//import {PostsService} from './posts/posts.service' // do without using @injectable decorator

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    FarmCallComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule, // for login and signup
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularMaterialModule,
    PostsModule,
    AuthModule,
    MatTableModule,
  ],
  providers: [{
    provide : HTTP_INTERCEPTORS,// we will provide new value to this token
    useClass : AuthInterceptor, // our interceptor that we created
    multi : true // other interceptors can exist as well
  }, {
    provide : HTTP_INTERCEPTORS, useClass : ErrorInterceptor,  multi : true
  }

], // providers: [PostsService], this can be done too
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
