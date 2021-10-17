import { CommonModule } from '@angular/common';
import {NgModule} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'; // will only be used in this module hence not
import { RouterModule } from '@angular/router';
// used anywhere else
import { AngularMaterialModule } from '../angular-material.module';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations:[
    PostCreateComponent,
    PostListComponent,
  ],
  imports:[
    ReactiveFormsModule,
    AngularMaterialModule,
    CommonModule, // common stuff like *ngif etc is included in this library
    RouterModule, // include module like router
    MatIconModule
  ]
})

export class PostsModule {};
