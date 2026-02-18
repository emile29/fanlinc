import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PostService } from '../../post.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-box',
  templateUrl: './post-box.component.html',
  styleUrls: ['./post-box.component.scss']
})
export class PostBoxComponent implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() author: string = '';
  @Input() timestamp: Date | string = '';
  @Input() likes: number = 0; // total score stored in DB (numVotes)
  @Input() postId: string = '';
  @Input() votes: any[] = [];
  @Input() fandom: string = '';
  @Input() image: string = '';
  @Input() fandomImage: string = '';
  @Input() comments: string[] = [];
  @Input() numOfComments: number = 0;

  userVote: 'up' | 'down' | null = null;
  currentUser: string = '';

  constructor(private postService: PostService, private session: LocalStorageService, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.session.retrieve('logged-in') || '';
    console.log('votes',this.votes);
    if (this.votes && this.currentUser) {
      const existing = this.votes.find(v => v.user === this.currentUser);
      if (existing) {
        this.userVote = existing.vote === 1 ? 'up' : 'down';
        console.log(this.userVote);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['votes'] || changes['currentUser']) {
      this.currentUser = this.session.retrieve('logged-in') || '';
      if (this.votes && this.currentUser) {
        const existing = this.votes.find(v => v.user === this.currentUser);
        this.userVote = existing ? (existing.vote === 1 ? 'up' : 'down') : null;
      } else {
        this.userVote = null;
      }
    }
  }

  get voteScore(): number {
    return this.likes;
  }

  onUpvote(): void {
    if (!this.currentUser) {
      if (confirm('Sign in first!!')) { window.location.href = '/login'; }
      return;
    }

    const action = 'up';
    this.postService.votePost(this.postId, this.currentUser, action).subscribe({
      next: (res: any) => {
        const body = res.body || res;
        // body is the updated post
        this.likes = body.numVotes;
        const existing = body.votes ? body.votes.find(v => v.user === this.currentUser) : null;
        this.userVote = existing ? (existing.vote === 1 ? 'up' : 'down') : null;
      },
      error: (err) => { console.error('Failed to vote', err); }
    });
  }

  onDownvote(): void {
    if (!this.currentUser) {
      if (confirm('Sign in first!!')) { window.location.href = '/login'; }
      return;
    }

    const action = 'down';
    this.postService.votePost(this.postId, this.currentUser, action).subscribe({
      next: (res: any) => {
        const body = res.body || res;
        this.likes = body.numVotes;
        const existing = body.votes ? body.votes.find(v => v.user === this.currentUser) : null;
        this.userVote = existing ? (existing.vote === 1 ? 'up' : 'down') : null;
      },
      error: (err) => { console.error('Failed to vote', err); }
    });
  }

  onShare(): void {
    // Implement share functionality
    console.log('Share post:', this.title);
  }

  onComment(): void {
    // Implement comment functionality
    console.log('Comment on post:', this.title);
    this.router.navigate(['/post-comments'], {queryParams: {postId: this.postId}});
  }
}