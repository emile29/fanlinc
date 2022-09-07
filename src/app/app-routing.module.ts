import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PostsComponent } from './posts/posts.component';
import { NewPostComponent } from './new-post/new-post.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { FandomsComponent } from './fandoms/fandoms.component';
import { FandomPageComponent } from './fandom-page/fandom-page.component';
import { NewFandomComponent } from './new-fandom/new-fandom.component';
import { CommentPgComponent } from './posts/comment-page.component';
import { EditFandomComponent } from './edit-fandom/edit-fandom.component';

const routes: Routes = [
	{ path: 'editprofile', component: EditProfileComponent },
	{ path: 'about', component: AboutComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'profile', component: UserProfileComponent },
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
export const routingComponents = [
	EditProfileComponent,
	AboutComponent,
	LoginComponent,
	RegisterComponent,
	UserProfileComponent,
	PageNotFoundComponent,
	FandomsComponent,
	FandomPageComponent,
	PostsComponent,
	NewPostComponent,
	CommentPgComponent,
	HomepageComponent,
	NewFandomComponent,
	EditFandomComponent
];
