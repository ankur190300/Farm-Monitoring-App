import {NgModule} from "@angular/core";
import { RouterModule, Routes } from "@angular/router";


import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {path:'login', component : LoginComponent},
  {path:'signup', component : SignupComponent},
]

@NgModule({
  imports:[
    RouterModule.forChild(routes) // a children of routemodule
  ],
  exports:[
    RouterModule
  ]
})
export class AuthRoutingModule{};
