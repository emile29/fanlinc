import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { LocalStorageService } from 'ngx-webstorage';


@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

	user = '';
	level = '';
	type = '';
	username = '';
	email = '';
	age = '';
	imagelink = '';
	bio = '';
	interests = [];
	fandoms = [];
	friends = [];
	isShow = false;
	isUnfriend = false;
	friendB = '';

	constructor(private renderer: Renderer2, private userService: UserService, private route: ActivatedRoute,
				private router: Router, private session: LocalStorageService) { }

	@HostListener('window:popstate', ['$event'])
	onPopState(event) {
		window.location.reload();
	}

	ngOnInit() {
		let userParam = this.route.snapshot.queryParamMap.get('user');
		this.user = this.session.retrieve('logged-in');
		if (this.user == userParam) {
			this.userService.getUserByUsername(this.user).subscribe(
				res => {
					if (res.status == 200) {
						this.username = res.body[0].username;
						this.email = res.body[0].email;
						this.age = res.body[0].profile.age;
						this.imagelink = res.body[0].image;
						this.bio = res.body[0].profile.bio;
						this.level = res.body[0].profile.level;
						this.type = res.body[0].profile.type;
						for (let i = 0; i < res.body[0].profile.interests.length; i++) {
							this.interests.push(res.body[0].profile.interests[i]);
						}
						for (let i = 0; i < res.body[0].profile.friends.length; i++) {
							this.friends.push(res.body[0].profile.friends[i]);
						}
						for (let i = 0; i < res.body[0].profile.subscribed.length; i++) {
							this.fandoms.push(res.body[0].profile.subscribed[i]);
						}
					}
				},
				err => {
					console.log(err);
					this.router.navigate(['/page-not-found']);
				}
			);
		}
		else if (this.user != userParam) {
			this.isShow = !this.isShow;
			this.userService.getUserByUsername(userParam).subscribe(
				res => {
					this.username = res.body[0].username;
					this.email = res.body[0].email;
					this.age = res.body[0].profile.age;
					this.imagelink = res.body[0].image;
					this.bio = res.body[0].profile.bio;
					this.level = res.body[0].profile.level;
					this.type = res.body[0].profile.type;
					for (let i = 0; i < res.body[0].profile.interests.length; i++) {
						this.interests.push(res.body[0].profile.interests[i]);
					}
					for (let i = 0; i < res.body[0].profile.friends.length; i++) {
						this.friends.push(res.body[0].profile.friends[i]);
					}
					for (let i = 0; i < res.body[0].profile.subscribed.length; i++) {
						this.fandoms.push(res.body[0].profile.subscribed[i]);
					}
					if (!(res.body[0].profile.friends).includes(this.user)) {
						if (this.route.snapshot.queryParamMap.get('req')) {
							this.friendB = 'accept friend request';
						}
						else {
							this.friendB = 'add friend';
						}
					}
					else {
						this.friendB = 'unfriend';
						this.isShow = !this.isShow;
						this.isUnfriend = !this.isUnfriend;
					}
				},
				err => {
					console.log(err);
					this.router.navigate(['/page-not-found']);
				}
			);
		}
		window.onhashchange = () => {
			window.location.reload();
		};
	}

	redirectToEditProfile() {
		this.router.navigate(['/editprofile'], { queryParams: { user: this.user } });
	}

	addFriendClicked(toBeAddedOrRemoved) {
		if (this.user != null && this.user != '') {
			if (this.friendB == 'add friend') {
				this.friendB = 'Friend Request Sent';
				this.renderer.setProperty(document.querySelector('#friendB'), 'disabled', true);
				this.userService.addPending(toBeAddedOrRemoved, this.user).subscribe(res => {console.log(res.body); }, err => {console.log(err); });
			}
			else if (this.friendB == 'Accept Friend Request') {
				this.userService.addFriend(this.user, toBeAddedOrRemoved).subscribe(res => {console.log(res.body); }, err => {console.log(err); });
				this.userService.addFriend(toBeAddedOrRemoved, this.user).subscribe(res => {console.log(res.body); }, err => {console.log(err); });
				this.renderer.setProperty(document.querySelector('#friendB'), 'disabled', true);
				this.userService.removePending(this.user, toBeAddedOrRemoved).subscribe(res => {console.log(res.body); window.location.reload(); },
					err => {console.log(err);
				});
			}
			else if (this.friendB == 'unfriend') {
				if (confirm('You are about to unfriend ' + toBeAddedOrRemoved)) {
					this.userService.removeFriend(this.user, toBeAddedOrRemoved).subscribe(res => {console.log(res.body); }, err => {console.log(err); });
					this.userService.removeFriend(toBeAddedOrRemoved, this.user).subscribe(res => {
						console.log(res.body);
						this.router.navigate(['/profile'], {queryParams: {user: toBeAddedOrRemoved}}).then(() => window.location.reload());
					},
					err => {console.log(err); });
				}
			}
		}
		else {
			if (confirm('Sign in first!!')) {
				this.router.navigate(['/login']);
			}
		}
	}

	toUserProfile(username) {
		this.router.navigate(['/profile'], {queryParams: {user: username}}).then(() => {window.location.reload(); });
	}

	toFandomPg(fandom) {
		this.router.navigate(['/fandom-page'], {queryParams: {fandom: fandom, sort:'popularity'}});
	}

	logout() {
		this.session.store('logged-in', '');
		this.router.navigate(['/login']).then(() => {window.location.reload(); });
	}

}
