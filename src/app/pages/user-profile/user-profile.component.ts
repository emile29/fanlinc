import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../user.service';
import { LocalStorageService } from 'ngx-webstorage';
import { PostService } from 'src/app/post.service';


@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

	user = '';
	// level = '';
	// type = '';
	username = '';
	password = '';
	email = '';
	age = '';
	imagelink = '';
	// bio = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";
	bio = "";
	// interests = ["guitar", "football", "music", "test", "test123", "test456"];
	interests = [];
	fandoms = [];
	friends = [];
	isShow = false;
	isUnfriend = false;
	friendB = '';
	isEdit = false;
	pendingFriends = [];
	subscribed = [];

	constructor(private renderer: Renderer2, private userService: UserService, private postService: PostService,
			private route: ActivatedRoute, private router: Router, private session: LocalStorageService) { }

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
						this.password = res.body[0].password;
						this.imagelink = res.body[0].image;
						this.bio = res.body[0].profile.bio;
						// this.level = res.body[0].profile.level;
						// this.type = res.body[0].profile.type;
						for (let i = 0; i < res.body[0].profile.interests.length; i++) {
							this.interests.push(res.body[0].profile.interests[i]);
						}
						this.subscribed = res.body[0].profile.subscribed;
						for (let i = 0; i < res.body[0].profile.friends.length; i++) {
							this.friends.push(res.body[0].profile.friends[i]);
						}
						// for (let i = 0; i < res.body[0].profile.subscribed.length; i++) {
						// 	this.fandoms.push(res.body[0].profile.subscribed[i]);
						// }
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
					this.password = res.body[0].password;
					this.imagelink = res.body[0].image;
					this.bio = res.body[0].profile.bio;
					// this.level = res.body[0].profile.level;
					// this.type = res.body[0].profile.type;
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

	redirectToChangePassword() {
		this.router.navigate(['/change-password']);
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

	saveChanges() {
		// if (interest != '') { this.interests.push(interest); }
		// if (this.imagelink != image) {
		// 	let posts: any;
		// 	this.postService.getAllPosts().subscribe(
		// 		res => {
		// 			posts = res.body;
		// 			for (let i = 0; i < posts.length; i++) {
		// 				if (posts[i].author == this.username) {
		// 					this.postService.setUserImage(posts[i]._id, image).subscribe(res => {console.log(res.body); }, err => {console.log(err); });
		// 				}
		// 			}
		// 		}
		// 	);
		// }
		console.log(this.username, this.email, this.password, this.bio, this.imagelink, this.interests, this.friends, this.pendingFriends, this.fandoms, this.subscribed);
		this.userService.updateUser(this.username, this.email, this.password, this.bio, this.imagelink, this.interests, this.friends, this.pendingFriends, this.fandoms, this.subscribed).subscribe(
			res => {
				console.log(res.body);
				if (res.status == 200) {
					this.router.navigate(['/profile'], { queryParams: { user: this.username } }).then(() => {window.location.reload(); });
				}
			},
			err => {
				if (err.status == 200) {
					this.router.navigate(['/profile'], { queryParams: { user: this.username } }).then(() => {window.location.reload(); });
				} else {
					console.log(err);
				}
			}
		);
	}

	handleChangeInterests(op, value) {
		console.log(op, value);
		//add logic to either add or remove interest based on op
		if (op == 'add') {
			if (value != '' && !this.interests.includes(value)) {
				this.interests.push(value);
			}
		}
		else if (op == 'remove') {
			const index = this.interests.indexOf(value);
			if (index > -1) {
				this.interests.splice(index, 1);
			}
		}
		console.log(this.interests);
	}

	cancelChanges() {
		this.router.navigate(['/profile'], { queryParams: { user: this.username } }).then(() => {window.location.reload(); });
	}

	changeProfilePicture() {
		// Create a file input element
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'image/*';
		fileInput.style.display = 'none';

		// Add event listener for file selection
		fileInput.addEventListener('change', (event: any) => {
			const file = event.target.files[0];
			if (file) {
				// Create a FileReader to convert the file to base64 or handle upload
				const reader = new FileReader();
				reader.onload = (e: any) => {
					// Update the image link with the new image
					this.imagelink = e.target.result;
					// You can also upload to a server here and get the URL
					console.log('New profile picture selected:', file.name);
				};
				reader.readAsDataURL(file);
			}
		});

		// Trigger the file input click
		fileInput.click();
	}
}
