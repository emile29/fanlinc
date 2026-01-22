import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post-box',
  templateUrl: './post-box.component.html',
  styleUrls: ['./post-box.component.scss']
})
export class PostBoxComponent implements OnInit {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() author: string = '';
  @Input() timestamp: Date | string = '';
  @Input() upvotes: number = 0;
  @Input() downvotes: number = 0;
  @Input() fandom: string = '';
  @Input() image: string = '';
  @Input() fandomImage: string = '';
  @Input() comments: string[] = [];

  userVote: 'up' | 'down' | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  get voteScore(): number {
    return this.upvotes - this.downvotes;
  }

  onUpvote(): void {
    if (this.userVote === 'up') {
      // Remove upvote
      this.upvotes--;
      this.userVote = null;
    } else {
      // Add upvote (remove downvote if present)
      if (this.userVote === 'down') {
        this.downvotes--;
      }
      this.upvotes++;
      this.userVote = 'up';
    }
  }

  onDownvote(): void {
    if (this.userVote === 'down') {
      // Remove downvote
      this.downvotes--;
      this.userVote = null;
    } else {
      // Add downvote (remove upvote if present)
      if (this.userVote === 'up') {
        this.upvotes--;
      }
      this.downvotes++;
      this.userVote = 'down';
    }
  }

  onShare(): void {
    // Implement share functionality
    console.log('Share post:', this.title);
  }

  onComment(): void {
    // Implement comment functionality
    console.log('Comment on post:', this.title);
  }
}