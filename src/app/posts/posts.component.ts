import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, QueryList, ViewChildren, Inject, RenderComponentType } from '@angular/core';
import * as $ from 'jquery';
import { PostService } from '../post.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { FandomService } from '../fandom.service';
import { UserService } from '../user.service';

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit{

	posts: any;
	fandoms: any;
	postsByFandom = [];
	postHeader = '';
	user = '';
	userImages = [];
	postImages = [];
	postTags = [];
	postIds = [];
	postTitles = [];
	postAuthors = [];
	postContents = [];
	postTimestamps = [];
	postNumVotes = [];
	postFandoms = [];
	postNumComments = [];
	fandomNames = [];
	fandomNames1 = ['none-selected'];
	fandomImages = [];
	containsImg = [];
	fandom = '';
	comments = [];
	checkPopularity = false;
	checkMostRecent = false;
	password = '';

	constructor(private r: Renderer2, private route: ActivatedRoute, private userService:UserService,
				private fandomService: FandomService, private router: Router, private postService:PostService,
				private session: LocalStorageService) {}

	ngOnInit() {
		this.user = this.session.retrieve('logged-in');
		this.userService.getUserByUsername(this.user).subscribe(
			res => {
					this.password = res.body[0].password;
			}
		);
		this.postService.getAllPosts().subscribe(
			res => {
				if (res.status == 200) {
					this.posts = res.body;
					if (this.route.snapshot.queryParamMap.get('sort') == 'popularity') {
						if (this.route.snapshot.queryParamMap.get('fandom')) {
							this.postHeader = 'Most Popular posts related to ' + this.route.snapshot.queryParamMap.get('fandom');
							this.sortByFandomImp(this.route.snapshot.queryParamMap.get('fandom'), 'popularity');
						}
						else {
							this.postHeader = 'Most Popular posts';
							this.sortByPopularityImp();
						}
					}
					else if (this.route.snapshot.queryParamMap.get('sort') == 'most-recent') {
						if (this.route.snapshot.queryParamMap.get('fandom')) {
							this.postHeader = 'Most Recent posts related to ' + this.route.snapshot.queryParamMap.get('fandom');
							this.sortByFandomImp(this.route.snapshot.queryParamMap.get('fandom'), 'most-recent');
						}
						else {
							this.postHeader = 'Most Recent posts';
							this.sortByMostRecentImp();
						}
					}
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
					this.sortFandoms();
					for (let i = 0; i < this.fandoms.length; i++) {
						this.fandomNames1.push(this.fandoms[i].name);
					}
				}
			},
			err => {
				console.log(err);
				this.router.navigate(['/page-not-found']);
			}
		);

		$('#recent-filter').on('click', () => {
			if ($('#pop-filter').is(':checked')) { $('#pop-filter').prop('checked', false); }
			this.checkMostRecent = !this.checkMostRecent;
		});

		$('#pop-filter').on('click', () => {
			if ($('#recent-filter').is(':checked')) { $('#recent-filter').prop('checked', false); }
			this.checkPopularity = !this.checkPopularity;
		});

		$('#recent-filter-1').on('click', () => {
			if ($('#pop-filter-1').is(':checked')) { $('#pop-filter-1').prop('checked', false); }
			this.checkMostRecent = !this.checkMostRecent;
		});

		$('#pop-filter-1').on('click', () => {
			if ($('#recent-filter-1').is(':checked')) { $('#recent-filter-1').prop('checked', false); }
			this.checkPopularity = !this.checkPopularity;
		});
	}

	setFandom(name) {
		if (this.fandom != '') {
			this.r.setStyle(document.querySelector('#' + this.fandom), 'background', 'white');
		}
		this.fandom = name;
		this.r.setStyle(document.querySelector('#' + name), 'background', '#ffaa5a');
	}

	sortFandoms() {
		let arr = [];
		for (let i = 0; i < this.fandoms.length; i++) {
			arr.push([this.fandoms[i].subcount, i]);
		}
		let sortedFandoms = arr.sort((a, b) => b[0] - a[0]);
		for (let i = 0; (i < sortedFandoms.length && i < 10); i++) {
			this.fandomImages.push(this.fandoms[sortedFandoms[i][1]].image);
			this.fandomNames.push(this.fandoms[sortedFandoms[i][1]].name);
		}
	}

	toSortedPostPg() {
		if (this.checkMostRecent) {
			if (this.fandom == '' || this.fandom == 'none-selected') {
				this.router.navigate(['/posts'], {queryParams: {sort: 'most-recent'}}).then(() => {window.location.reload(); });
			}
			else {
				this.router.navigate(['/posts'], {queryParams: {sort: 'most-recent', fandom: this.fandom}}).then(() => {window.location.reload(); });
			}
		}
		else if (this.checkPopularity) {
			if (this.fandom == '' || this.fandom == 'none-selected') {
				this.router.navigate(['/posts'], {queryParams: {sort: 'popularity'}}).then(() => {window.location.reload(); });
			}
			else {
				this.router.navigate(['/posts'], {queryParams: {sort: 'popularity', fandom: this.fandom}}).then(() => {window.location.reload(); });
			}
		}
		else {
			alert('Select a sort option!!');
		}
	}

	sortByPopularityImp() {
		let arr = [];
		for (let i = 0; i < this.posts.length; i++) {
			arr.push([this.posts[i].numVotes, i]);
		}
		let sortedPosts = arr.sort((a, b) => b[0] - a[0]);
		for (let i = 0; i < sortedPosts.length; i++) {
			this.postNumVotes.push(this.posts[sortedPosts[i][1]].numVotes);
			this.postTitles.push(this.posts[sortedPosts[i][1]].title);
			this.postContents.push(this.posts[sortedPosts[i][1]].content);
			this.userImages.push(this.posts[sortedPosts[i][1]].userImage);
			if (this.posts[sortedPosts[i][1]].image != null) {
				this.postImages.push(this.posts[sortedPosts[i][1]].image);
			}
			else {
				this.postImages.push('');
			}
			this.postAuthors.push(this.posts[sortedPosts[i][1]].author);
			this.postTags.push(this.posts[sortedPosts[i][1]].tags);
			this.postNumComments.push(this.posts[sortedPosts[i][1]].comments.length);
			if (this.posts[sortedPosts[i][1]].comments.length <= 1) { this.comments.push('comment'); }
			else { this.comments.push('comments'); }
			this.postTimestamps.push(this.timeDifference((new Date().getTime()), this.posts[sortedPosts[i][1]].timestamp));
			this.postIds.push(this.posts[sortedPosts[i][1]]._id);
			this.postFandoms.push(this.posts[sortedPosts[i][1]].fandom);
		}
	}

	sortByMostRecentImp() {
		let arr = [];
		for (let i = 0; i < this.posts.length; i++) {
			arr.push([this.posts[i].timestamp, i]);
		}
		let sortedPosts = arr.sort((a, b) => b[0] - a[0]);
		for (let i = 0; i < sortedPosts.length; i++) {
			this.postNumVotes.push(this.posts[sortedPosts[i][1]].numVotes);
			this.postTitles.push(this.posts[sortedPosts[i][1]].title);
			this.postContents.push(this.posts[sortedPosts[i][1]].content);
			this.userImages.push(this.posts[sortedPosts[i][1]].userImage);
			if (this.posts[sortedPosts[i][1]].image != null) {
				this.postImages.push(this.posts[sortedPosts[i][1]].image);
			}
			else {
				this.postImages.push('');
			}
			this.postAuthors.push(this.posts[sortedPosts[i][1]].author);
			this.postTags.push(this.posts[sortedPosts[i][1]].tags);
			this.postNumComments.push(this.posts[sortedPosts[i][1]].comments.length);
			if (this.posts[sortedPosts[i][1]].comments.length <= 1) { this.comments.push('comment'); }
			else { this.comments.push('comments'); }
			this.postTimestamps.push(this.timeDifference((new Date().getTime()), this.posts[sortedPosts[i][1]].timestamp));
			this.postIds.push(this.posts[sortedPosts[i][1]]._id);
			this.postFandoms.push(this.posts[sortedPosts[i][1]].fandom);
		}
	}

	sortByFandomImp(name, cond) {
		for (let i = 0; i < this.posts.length; i++) {
			if (this.posts[i].fandom == name) {
				this.postsByFandom.push(this.posts[i]);
			}
		}
		this.posts = this.postsByFandom;
		if (cond == 'popularity') { this.sortByPopularityImp(); }
		else { this.sortByMostRecentImp(); }
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
			if (hours == 1) { return (hours + ' hour ago'); }
			return (hours + ' hours ago');
		}
		if (mins <= 1) { return (mins + ' min ago'); }
		return (mins + ' mins ago');
	}

	id = ''; num = 0; numUpClick = 0; numDownClick = 0;
	upvote(postId, numVotes) {
		if (this.user != '' && this.user != null) {
			let numVotes1 = parseInt(numVotes);
			if ((this.id != postId && this.numUpClick == 0 && this.numDownClick == 1) || (this.id == postId && this.numUpClick == 0 && this.numDownClick == 1 || this.id != postId)) {
				this.id = postId;
				this.num = numVotes1 + 1;
				this.numUpClick = 1;
				this.numDownClick = 0;
				$('#' + postId).html(this.num);
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

	downvote(postId, numVotes) {
		if (this.user != '' && this.user != null) {
			let numVotes1 = parseInt(numVotes);
			if ((this.id != postId && this.numDownClick == 0  && this.numDownClick == 0) || (this.id == postId && this.numUpClick == 1 && this.numDownClick == 0) || this.id != postId) { //first post clicked
				this.id = postId;
				this.num = numVotes1 - 1;
				this.numDownClick = 1;
				this.numUpClick = 0;
				$('#' + postId).html(this.num);
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

	redirectToFandom(fandom) {
			this.router.navigate(['/fandom-page'], {queryParams: {fandom: fandom, sort:'popularity'}});
	}

	toCommentPg(postId) {
		this.router.navigate(['/post-comments'], {queryParams: {postId: postId}});
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

	toNewPost() {
		if (this.user != null && this.user != '') {
			this.router.navigate(['/create-new-post']);
		}
		else {
			if (confirm('Sign in first!!')) {
				this.router.navigate(['/login']);
			}
		}
	}

	toNewFandom() {
		if (this.user != null && this.user != '') {
			this.router.navigate(['/create-new-fandom']);
		}
		else {
			if (confirm('Sign in first!!')) {
				this.router.navigate(['/login']);
			}
		}
	}

	toFandom(fandom) {
		this.router.navigate(['/fandoms'], {queryParams: {fandom:fandom}});
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
