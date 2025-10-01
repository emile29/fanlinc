import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ModuleWithComponentFactories } from '@angular/core';
import { UserService } from '../../user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
	selector: 'app-homepage',
	templateUrl: './homepage.component.html',
	styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

	form: FormGroup;
	message = '';

	constructor(private userService: UserService, private fb: FormBuilder, private router: Router,
				private session: SessionStorageService) { }

	ngOnInit() {
		this.form = this.fb.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});
	}

	getUser(username, password) {
		if (this.form.valid) {
			this.userService.getUser(username, password).subscribe(
				res => {
					if (res.status == 200) {
						console.log("User '" + username + "' retrieved");
						this.session.store('logged-in', username);
						// this.router.navigate(['/profile'], {'queryParams': {'user': username}});
						this.router.navigate(['/fandoms']);
					}
				},
				err => {
					console.log(err);
					this.message = 'username or password is invalid';
				}
			);
		}
	}

}
