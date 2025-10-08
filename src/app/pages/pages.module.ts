import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './home/homepage.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PostsComponent } from './posts/posts.component';
import { NewPostComponent } from './new-post/new-post.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { FandomsComponent } from './fandoms/fandoms.component';
import { FandomPageComponent } from './fandom/fandom-page.component';
import { NewFandomComponent } from './new-fandom/new-fandom.component';
import { CommentPgComponent } from './posts/comment-page.component';
import { EditFandomComponent } from './edit-fandom/edit-fandom.component';
import { ChangePasswordComponent } from './user-profile/change-password/change-password.component';
import { PostBoxComponent } from '../components/post-box/post-box.component';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    HomepageComponent,
    AboutComponent,
    PageNotFoundComponent,
    UserProfileComponent,
    PostsComponent,
    NewPostComponent,
    EditProfileComponent,
    FandomsComponent,
    FandomPageComponent,
    NewFandomComponent,
    CommentPgComponent,
    EditFandomComponent,
    ChangePasswordComponent,
    PostBoxComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    RegisterComponent,
    LoginComponent,
    HomepageComponent,
    AboutComponent,
    PageNotFoundComponent,
    UserProfileComponent,
    PostsComponent,
    NewPostComponent,
    EditProfileComponent,
    FandomsComponent,
    FandomPageComponent,
    NewFandomComponent,
    CommentPgComponent,
    EditFandomComponent,
    ChangePasswordComponent
  ]
})
export class PagesModule { }