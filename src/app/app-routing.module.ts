import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HomepageComponent } from './pages/home/homepage.component';
import { AboutComponent } from './pages/about/about.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { PostsComponent } from './pages/posts/posts.component';
import { NewPostComponent } from './pages/new-post/new-post.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { FandomsComponent } from './pages/fandoms/fandoms.component';
import { FandomPageComponent } from './pages/fandom/fandom-page.component';
import { NewFandomComponent } from './pages/new-fandom/new-fandom.component';
import { CommentPgComponent } from './pages/posts/comment-page.component';
import { EditFandomComponent } from './pages/edit-fandom/edit-fandom.component';
import { ChangePasswordComponent } from './pages/user-profile/change-password/change-password.component';

const routes: Routes = [
	{ path: 'editprofile', component: EditProfileComponent },
	{ path: 'about', component: AboutComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'profile', component: UserProfileComponent },
	{ path: 'change-password', component: ChangePasswordComponent },
	{ path: 'page-not-found', component: PageNotFoundComponent },
	{ path: 'fandoms', component: FandomsComponent },
	{ path: 'fandom-page', component: FandomPageComponent },
	{ path: 'create-new-post', component: NewPostComponent },
	{ path: 'post-comments', component: CommentPgComponent },
	{ path: '', component: HomepageComponent},
	{ path: 'create-new-fandom', component: NewFandomComponent },
	{ path: 'posts', component: PostsComponent },
	{ path: 'editfandom', component: EditFandomComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
