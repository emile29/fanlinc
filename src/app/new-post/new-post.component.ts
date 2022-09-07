import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PostService } from '../post.service';
import { LocalStorageService } from 'ngx-webstorage';
import { UserService } from '../user.service';
import { FandomService } from '../fandom.service';

@Component({
	selector: 'app-new-post',
	templateUrl: './new-post.component.html',
	styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {

	message = '';
	fandoms = ['none-selected'];
	fandom = '';
	body: any;
	fandomPg = '';
	fandomBacks = {'none-selected':'white'};

	constructor(private r: Renderer2, private fandomService: FandomService, private userService: UserService,
				private router: Router, private route: ActivatedRoute, private postService: PostService,
				private session: LocalStorageService) {}

	ngOnInit() {
		if (this.route.snapshot.queryParamMap.get('fandom')) {
			this.fandomPg = this.route.snapshot.queryParamMap.get('fandom');
		}
		this.fandomService.getAllFandoms().subscribe(
			res => {
				console.log(res.body);
				this.body = res.body;
				for (let i = 0; i < this.body.length; i++) {
					this.fandoms.push(this.body[i].name);
					if (this.fandomPg != '') {
						if (this.body[i].name != this.fandomPg) { this.fandomBacks[this.body[i].name] = 'white'; }
						else { this.fandomBacks[this.body[i].name] = 'orange'; }
					}
				}
			},
			err => {console.log(err); }
		);
	}

	setFandom(name) {
		if (this.fandom != '') { this.fandomBacks[this.fandom] = 'white'; }
		if (name != this.fandomPg) { this.fandomBacks[this.fandomPg] = 'white'; }
		this.fandom = name;
		this.fandomBacks[name] = '#ffaa5a';
	}

	createPost(title, tags, content, image) {
		let timestamp = new Date().getTime();
		this.message = '';
		if (title != '' && tags != '' && content != '' && (this.fandom != '' || this.fandomPg != '')) {
			let author = this.session.retrieve('logged-in');
			let comments = [];
			let numVotes = 0;
			let userImage = '';
			this.userService.getUserByUsername(author).subscribe(
				res => {
					userImage = res.body[0].image;
					let fd = '';
					if (this.fandom != '') { fd = this.fandom; }
					else { fd = this.fandomPg; }
					this.postService.addPost(tags, title, content, image, author, timestamp, comments, numVotes, fd, userImage).subscribe(
						res => {
							if (res.status == 200) {
								console.log('Post succesfully created', res);
								if (this.fandomPg != '') { this.router.navigate(['/fandom-page'], {queryParams: {fandom: this.fandomPg, sort:'popularity'}}); }
								else { this.router.navigate(['/posts'], {queryParams: {sort: 'popularity'}}).then(() => {window.location.reload(); }); }
							}
						},
						err => {
							console.log(err);
							this.router.navigate(['/page-not-found']);
						}
					);
				},
				err => {
					console.log(err);
				}
			);
		}
		else {
			this.message = 'some fields are still missing';
		}
	}

}
