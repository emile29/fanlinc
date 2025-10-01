import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserService } from './user.service';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { SidenavbarComponent } from './components/sidenavbar/sidenavbar.component';
import { TopnavbarComponent } from './components/topnavbar/topnavbar.component';
import { PagesModule } from './pages/pages.module';

@NgModule({
	declarations: [
		AppComponent,
		SidenavbarComponent,
		TopnavbarComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		NgbModule,
		NgbDropdownModule,
		MatToolbarModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		HttpClientModule,
		NgxWebstorageModule.forRoot(),
		PagesModule
	],
	providers: [UserService],
	bootstrap: [AppComponent]
})
export class AppModule { }
