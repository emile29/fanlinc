import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserService } from './user.service';
import { NgxWebstorageModule } from 'ngx-webstorage';

@NgModule({
	declarations: [
		AppComponent,
		routingComponents
	],
	imports: [
		NgbDropdownModule,
		BrowserModule,
		NgbModule,
		MatToolbarModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		HttpClientModule,
		MDBBootstrapModule.forRoot(),
		NgxWebstorageModule.forRoot()
	],
	providers: [UserService],
	bootstrap: [AppComponent]
})
export class AppModule { }
