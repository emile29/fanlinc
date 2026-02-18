import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class PostService {

	uri = '';

	constructor(private http: HttpClient, private router: Router) {
		if (environment.production) {
			this.uri = '/api';
		} else {
			this.uri = 'http://localhost:8080/api';
		}
	}

	addPost(tags, title, content, image, author, timestamp, comments, numVotes, fandom, userImage) {
		const body = {
			tags,
			title,
			content,
			image,
			author,
			timestamp,
			comments,
			numVotes,
			fandom,
			userImage
		};
		return this.http.post(`${this.uri}/posts/add`, body, {observe: 'response'});
	}

	getAssociatedPosts(fandomName) {
		return this.http.get(`${this.uri}/posts/allposts/${fandomName}`, {observe: 'response'});
	}

	getAllPosts() {
		return this.http.get(`${this.uri}/posts`, {observe: 'response'});
	}

	getPost(id) {
		return this.http.get(`${this.uri}/posts/${id}`);
	}

	addComment(id, newComment, author, parentCommentId = null) {
		return this.http.post(`${this.uri}/posts/addComment/${id}`, {newComment, author, parentCommentId}, {observe: 'response'});
	}

	setNumVotes(id, numVotes) {
		return this.http.post(`${this.uri}/posts/setNumVotes/${id}`, {numVotes}, {observe: 'response'});
	}

	votePost(id, username, vote) {
		// vote: 'up' | 'down' | 'remove'
		return this.http.post(`${this.uri}/posts/vote/${id}`, {username, vote}, {observe: 'response'});
	}

	updatePost(id, title, author, timestamp, numVotes) {
		const body = {
			title:title,
			author:author,
			timestamp:timestamp,
			numVotes:numVotes
		};
		return this.http.post(`${this.uri}/posts/update/${id}`, body, {observe: 'response'});
	}

	setUserImage(id, image) {
		return this.http.post(`${this.uri}/posts/setUserImage/${id}`, {image: image}, {observe: 'response'});
	}

	deletePost(id) {
		return this.http.delete(`${this.uri}/posts/delete/${id}`, {observe: 'response'});
	}

}
