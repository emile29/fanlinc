import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { PostService } from '../../post.service';
import { User } from '../interfaces/user.interface';

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
	profileForm: FormGroup;
	username: string = '';
	types: string[] = ['Artist', 'Blogger', 'Gamer', 'Musician', 'Reader'];
	levels: string[] = ['Beginner', 'Casual', 'Very-involved', 'Expert'];
	interests: string[] = [];
	pendingFriends: string[] = [];
	friends: string[] = [];
	fandoms: string[] = [];
	subscribed: string[] = [];

	constructor(
		private userService: UserService,
		private postService: PostService,
		private route: ActivatedRoute,
		private router: Router,
		private r: Renderer2,
		private fb: FormBuilder
	) {
		this.profileForm = this.fb.group({
			password: ['', [Validators.required, Validators.minLength(6)]],
			email: ['', [Validators.required, Validators.email]],
			type: [''],
			level: [''],
			bio: [''],
			age: ['', [Validators.min(0)]],
			image: ['', [Validators.required]],
			newInterest: ['']
		});
	}

	ngOnInit() {
		this.userService.getUserByUsername(this.route.snapshot.queryParamMap.get('user')).subscribe({
			next: (res) => {
				const user = res.body[0];
				this.username = user.username;
				this.profileForm.patchValue({
					password: user.password,
					email: user.email,
					bio: user.profile.bio,
					age: user.profile.age,
					image: user.image,
					type: user.profile.type,
					level: user.profile.level
				});
				this.friends = user.profile.friends;
				this.pendingFriends = user.profile.pending_friends;
				this.fandoms = user.profile.fandoms;
				this.interests = [...user.profile.interests];
				this.subscribed = user.profile.subscribed;
			},
			error: (err) => {
				console.error(err);
				this.router.navigate(['/page-not-found']);
			}
		});
	}

	setType(type: string): void {
		this.profileForm.patchValue({ type });
		const elements = document.querySelectorAll('.choose-type-dropdown-item');
		elements.forEach(el => this.r.setStyle(el, 'background', 'white'));
		this.r.setStyle(document.querySelector('#' + type), 'background', 'var(--primary-color)');
	}

	setLevel(level: string): void {
		this.profileForm.patchValue({ level });
		const elements = document.querySelectorAll('.choose-level-dropdown-item');
		elements.forEach(el => this.r.setStyle(el, 'background', 'white'));
		this.r.setStyle(document.querySelector('#' + level), 'background', 'var(--primary-color)');
	}

	onSubmit(): void {
		if (this.profileForm.valid) {
			const formValue = this.profileForm.value;

			if (formValue.newInterest) {
				this.interests.push(formValue.newInterest);
				this.profileForm.patchValue({ newInterest: '' });
			}

			if (formValue.image !== this.profileForm.get('image')?.value) {
				this.postService.getAllPosts().subscribe({
					next: (res) => {
						const posts = Array.isArray(res.body) ? res.body : [];
						posts.forEach((post: any) => {
							if (post.author === this.username) {
								this.postService.setUserImage(post._id, formValue.image).subscribe({
									next: (res) => console.log(res.body),
									error: (err) => console.error(err)
								});
							}
						});
					}
				});
			}

			this.userService.updateUser(
				this.username,
				formValue.email,
				formValue.password,
				formValue.bio,
				formValue.age,
				formValue.image,
				this.interests,
				formValue.type,
				formValue.level,
				this.friends,
				this.pendingFriends,
				this.fandoms,
				this.subscribed
			).subscribe({
				next: (res) => {
					console.log(res.body);
					if (res.status === 200) {
						this.router.navigate(['/profile'], { queryParams: { user: this.username } });
					}
				},
				error: (err) => console.error(err)
			});
	}
	}
}
