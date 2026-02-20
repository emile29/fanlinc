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
	commentUserImages: { [username: string]: string } = {};
	postAuthor:string;
	postContent:string;
	postTimestamp :string;
	postNumVote:number;
	postFandom:string;
	postNumComment:number;
	postComments = [];
	showReplyFor: { [key: string]: boolean } = {};
	// comments = '';
	fandoms: any;
	postVotes: any;

	constructor(private userService: UserService, private router: Router, private route: ActivatedRoute,
				private fandomService: FandomService, private postService: PostService, private session: LocalStorageService) {}

	ngOnInit(): void {
		this.user = this.session.retrieve('logged-in');
		this.postService.getPost(this.route.snapshot.queryParamMap.get('postId')).subscribe(
			(post: any) => {
				console.log('post',post);
				this.post = post;
				this.postTitle = this.post.title;
				this.postContent = this.post.content;
				this.postImage = this.post.image || '';
				this.postAuthor = this.post.author;
				this.postTag = this.post.tags;
				this.postNumComment = (typeof this.post.totalComments === 'number') ? this.post.totalComments : (this.post.comments || []).length;
				// this.comments = this.postNumComment <= 1 ? 'comment' : 'comments';
				// this.postTimestamp = this.timeDifference((new Date().getTime()), this.post.timestamp);
				this.postTimestamp = this.post.timestamp;
				this.postNumVote = this.post.numVotes;
				this.postId = this.post._id;
				this.postFandom = this.post.fandom;
				this.postComments = this.post.comments || [];
				this.userImage = this.post.userImage;
				this.postVotes = this.post.votes || [];
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

	/**
	 * Returns the profile image URL for a comment author.
	 * - Accepts either a username string or an author object with `username`/`image`.
	 * - Uses a small in-memory cache to avoid repeated HTTP lookups.
	 */
	getCommentAuthorImage(author: any): string {
		const defaultProfile = 'https://secure.gravatar.com/avatar/755ba87e0a9949e846b042a8ac44723e?s=600&d=mm&r=g';
		const username = (author && (author.username || author)) || '';
		if (!username) { return defaultProfile; }
		if (author && author.image) { return author.image; }
		if (this.commentUserImages[username]) { return this.commentUserImages[username]; }
		// populate cache asynchronously; return default while loading
		this.commentUserImages[username] = defaultProfile;
		this.userService.getUserByUsername(username).subscribe(
			(res: any) => {
				try {
					const img = res && res.body && res.body[0] && res.body[0].image ? res.body[0].image : defaultProfile;
					this.commentUserImages[username] = img;
				} catch (e) {
					this.commentUserImages[username] = defaultProfile;
				}
			},
			err => { this.commentUserImages[username] = defaultProfile; }
		);
		return defaultProfile;
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

	toggleReplyBox(commentId: string) {
		this.showReplyFor[commentId] = !this.showReplyFor[commentId];
	}

	sendReply(replyText: string, parentCommentId: string) {
		if (!replyText || replyText.trim() === '') { alert('Reply something first!!'); return; }
		this.postService.addComment(this.postId, replyText, this.session.retrieve('logged-in'), parentCommentId).subscribe(
			res => {
				console.log(res.body);
				window.location.reload();
			},
			err => { console.log(err); }
		);
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
