import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

	form: FormGroup;
	message = '';

	constructor(private userService: UserService, private fb: FormBuilder, private router: Router,
				private session: LocalStorageService) { }

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
						this.router.navigate(['/posts'], {queryParams: {sort: 'popularity'}}).then(() => {window.location.reload(); });
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
