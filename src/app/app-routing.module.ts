import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router' // enables routing

import {PostListComponent} from './posts/post-list/post-list.component';
import {PostCreateComponent} from './posts/post-create/post-create.component';
import { AuthGuard } from './auth/auth.guard';
import { FarmCallComponent } from './farm-call/farm-call.component';

const routes :Routes = [

    {path:'', component : PostListComponent},// structure of routing
    {path:'create', component : PostCreateComponent, canActivate:[AuthGuard]},// front end protection
    //                                                                          along with backend protection
    {path:'edit/:postId', component : PostCreateComponent, canActivate:[AuthGuard]},// front end protection
    //                                                                          along with backend protection
    //{path:'auth', loadChildren:"./auth/auth.module.ts#AuthModule"}, // it will be loaded lazily
    // alternative method // the above won't work in the newer version
    {path:'auth', loadChildren:()=>import('./auth/auth.module').then(m=>m.AuthModule)},
    {path:'farm', component :FarmCallComponent}

];

@NgModule({
  imports :[RouterModule.forRoot(routes)], // to make anglar router aware of our routes
  exports :[RouterModule], // so that route config can be used outside of this file
  providers :[AuthGuard]
})

export class AppRoutingModule{};
