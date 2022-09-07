import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { PostService } from '../post.service';

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
	username = '';
	password = '';
	email = '';
	bio = '';
	age = '';
	image = '';
	type = '';
	level = '';
	newType = '';
	newLevel = '';
	types = ['Artist', 'Blogger', 'Gamer', 'Musician', 'Reader'];
	levels = ['Beginner', 'Casual', 'Very-involved', 'Expert'];
	interests = [];
	pendingFriends = [];
	friends = [];
	fandoms = [];
	subscribed = [];

	constructor(private userService: UserService, private postService: PostService, private route: ActivatedRoute,
				private router: Router, private r: Renderer2) { }

	ngOnInit() {
		this.userService.getUserByUsername(this.route.snapshot.queryParamMap.get('user')).subscribe(
			res => {
				this.username = res.body[0].username;
				(document.getElementById('password') as HTMLInputElement).value = res.body[0].password;
				(document.getElementById('email') as HTMLInputElement).value = res.body[0].email;
				(document.getElementById('bio') as HTMLInputElement).value = res.body[0].profile.bio;
				(document.getElementById('age') as HTMLInputElement).value = res.body[0].profile.age;
				(document.getElementById('image') as HTMLInputElement).value = res.body[0].image;
				this.image = res.body[0].image;
				(document.getElementById('level') as HTMLInputElement).value = res.body[0].profile.level;
				this.level = res.body[0].profile.level;
				(document.getElementById('type') as HTMLInputElement).value = res.body[0].profile.type;
				this.type = res.body[0].profile.type;
				this.friends = res.body[0].profile.friends;
				this.pendingFriends = res.body[0].profile.pending_friends;
				this.fandoms = res.body[0].profile.fandoms;
				for (let i = 0; i < res.body[0].profile.interests.length; i++) {
					this.interests.push(res.body[0].profile.interests[i]);
				}
				this.subscribed = res.body[0].profile.subscribed;
			},
			err => {
				console.log(err);
				this.router.navigate(['/page-not-found']);
			}
		);
	}

	setType(type) {
		if (this.newType != '') { this.r.setStyle(document.querySelector('#' + this.newType), 'background', 'white'); }
		this.newType = type;
		this.r.setStyle(document.querySelector('#' + type), 'background', 'orange');
	}

	setLevel(level) {
		if (this.newLevel != '') { this.r.setStyle(document.querySelector('#' + this.newLevel), 'background', 'white'); }
		this.newLevel = level;
		this.r.setStyle(document.querySelector('#' + level), 'background', 'orange');
	}

	saveChanges(password, email, bio, age, image, interest) {
		if (interest != '') { this.interests.push(interest); }
		let type = this.type, level = this.level;
		if (this.newType != '') { type = this.newType; }
		if (this.newLevel != '') { level = this.newLevel; }
		if (this.image != image) {
			let posts: any;
			this.postService.getAllPosts().subscribe(
				res => {
					posts = res.body;
					for (let i = 0; i < posts.length; i++) {
						if (posts[i].author == this.username) {
							this.postService.setUserImage(posts[i]._id, image).subscribe(res => {console.log(res.body); }, err => {console.log(err); });
						}
					}
				}
			);
		}
		this.userService.updateUser(this.username, email, password, bio, age, image, this.interests, type, level, this.friends, this.pendingFriends, this.fandoms, this.subscribed).subscribe(
			res => {
				console.log(res.body);
				if (res.status == 200) {
					this.router.navigate(['/profile'], { queryParams: { user: this.username } }).then(() => {window.location.reload(); });
				}
			},
			err => {
				console.log(err);
			}
		);
	}
}
