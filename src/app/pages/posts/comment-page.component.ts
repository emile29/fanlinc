import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, QueryList, ViewChildren, Inject } from '@angular/core';
import * as $ from 'jquery';
import { PostService } from '../../post.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { UserService } from '../../user.service';
import { FandomService } from 'src/app/fandom.service';

@Component({
	selector: 'app-comment-page',
	templateUrl: './comment-page.component.html',
	styleUrls: ['./comment-page.component.scss']
})
export class CommentPgComponent implements OnInit{

	@ViewChild('replyBox', {static:false}) replyBox: ElementRef;

	isShow = false;
	user = '';
	post: any;
	postImage:string;
	postTag:string;
	postId:string;
	postTitle:string;
	userImage = '';
	postAuthor:string;
	postContent:string;
	postTimestamp :string;
	postNumVote:number;
	postFandom:string;
	postNumComment:number;
	postComments = [];
	comments = '';
	fandoms: any;
	postVotes: any;

	constructor(private userService: UserService, private router: Router, private route: ActivatedRoute,
				private fandomService: FandomService, private postService: PostService, private session: LocalStorageService) {}

	ngOnInit(): void {
		this.user = this.session.retrieve('logged-in');
		this.postService.getPost(this.route.snapshot.queryParamMap.get('postId')).subscribe(
			res => {
				if (res.status == 200) {
					console.log(res.body);
					this.post = res.body;
					this.postTitle = this.post[0].title;
					this.postContent = this.post[0].content;
					if (this.post[0].image != null) {
							this.postImage = this.post[0].image;
					}
					else {
							this.postImage = '';
					}
					this.postAuthor = this.post[0].author;
					this.postTag = this.post[0].tags;
					this.postNumComment = this.post[0].comments.length;
					if (this.post[0].comments.length <= 1) { this.comments = 'comment'; }
					else { this.comments = 'comments'; }
					this.postTimestamp = this.timeDifference((new Date().getTime()), this.post[0].timestamp);
					this.postNumVote = this.post[0].numVotes;
					this.postId = this.post[0]._id;
					this.postFandom = this.post[0].fandom;
					this.postComments = this.post[0].comments;
					this.userImage = this.post[0].userImage;
					this.postVotes = this.post[0].votes;
				}
			},
			err => {
				console.log(err);
				this.router.navigate(['/page-not-found']);
			}
		);
		this.fandomService.getAllFandoms().subscribe(
			res => {
				if (res.status == 200) {
					this.fandoms = res.body;
				}
			},
			err => {
				console.log(err);
				this.router.navigate(['/page-not-found']);
			}
		);
	}

	getFandomImage(name) {
		for (let i = 0; i < this.fandoms.length; i++) {
			if (this.fandoms[i].name == name) {
				return this.fandoms[i].image;
			}
		}
		return '';
	}

	timeDifference(now, date2) {
		let days = Math.round(Math.abs(now - date2) / (24 * 60 * 60 * 1000));
		let hours = Math.round(Math.abs(now - date2) / (60 * 60 * 1000));
		let mins = Math.round(Math.abs(now - date2) / (60 * 1000));
		if (hours > 23) {
			if (days == 1) { return (days + ' day ago'); }
			return (days + ' days ago');
		}
		if (mins > 59) {
			if (hours == 1) { return (hours + ' day ago'); }
			return (hours + ' hours ago');
		}
		if (mins == 1) { return (mins + ' min ago'); }
		return (mins + ' mins ago');
	}

	replyClick() {
		if (this.session.retrieve('logged-in') != null && this.session.retrieve('logged-in') != '') {
				this.isShow = !this.isShow;
		}
		else {
				if (confirm('Sign in first!!')) { this.router.navigate(['/login']); }
		}
	}

	id = ''; num = 0; numUpClick = 0; numDownClick = 0;
	upvote() {
		if (this.user != '' && this.user != null) {
				let postId = this.postId; let numVotes = this.postNumVote;
				if ((this.id != postId && this.numUpClick == 0) || (this.id == postId && this.numUpClick == 0 && this.numDownClick == 1)) { //first post clicked
						this.id = postId;
						this.num = numVotes + 1;
						this.numUpClick = 1;
						this.numDownClick = 0;
						$('#numVote').html(this.num);
						this.postService.setNumVotes(postId, this.num).subscribe(
								res => {
								console.log(res.body);
								}
						);
				}
		}
		else {
				if (confirm('Sign in first!!')) { this.router.navigate(['/login']); }
		}
	}

	downvote() {
		if (this.user != '' && this.user != null) {
			let postId = this.postId; let numVotes = this.postNumVote;
			if ((this.id != postId && this.numDownClick == 0) || (this.id == postId && this.numUpClick == 1 && this.numDownClick == 0)) { //first post clicked
					this.id = postId;
					this.num = numVotes - 1;
					this.numDownClick = 1;
					this.numUpClick = 0;
					$('#numVote').html(this.num);
					this.postService.setNumVotes(postId, this.num).subscribe(
							res => {
							console.log(res.body);
							}
					);
			}
		}
		else {
			if (confirm('Sign in first!!')) { this.router.navigate(['/login']); }
		}
	}

	sendComment(comment) {
		if (comment != '') {
			this.postService.addComment(this.postId, comment, this.session.retrieve('logged-in')).subscribe(
				res => {
						console.log(res.body);
						window.location.reload();
				},
				err => {
						console.log(err);
				}
			);
		}
		else {
			alert('Comment something first!!');
		}
	}

	redirectToFandom(fandom) {
		this.router.navigate(['/fandom-page'], {queryParams: {fandom: fandom, sort: 'popularity'}});
	}

	toUserProfile(username) {
		this.userService.getUserByUsername(this.user).subscribe(
			res => {
				if (res.body[0].profile.pending_friends.includes(username)) {
				this.router.navigate(['/profile'], {queryParams: {user: username, req: true}});
				}
				else { this.router.navigate(['/profile'], {queryParams: {user: username}}); }
			},
			err => {
				console.log(err);
			}
		);
	}

	deletePost(id, author) {
		if (author == this.user) {
			// let username = prompt('Confirm username');
			// let password = prompt('Confirm password');
			if (confirm('You are about to delete a post!!')) {
				this.postService.deletePost(id).subscribe(
					res => {
						console.log(res.body);
						window.location.reload();
					},
					err => {
						console.log(err);
					}
				);
			}
		}
		else {
			alert("That's not your post!!");
		}
	}

}
