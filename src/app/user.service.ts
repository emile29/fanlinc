import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { User } from './pages/interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	uri = '';

	constructor(private http: HttpClient, private router: Router) {
		if (environment.production) {
			this.uri = '/api';
		} else {
			this.uri = 'http://localhost:8080/api';
		}
	}

	getAllUsers(): Observable<User[]> {
		return this.http.get<User[]>(`${this.uri}/users`);
	}

	getUser(username: string, password: string): Observable<HttpResponse<User[]>> {
		return this.http.get<User[]>(`${this.uri}/users/${username}/${password}`, { observe: 'response' });
	}

	getUserByUsername(username: string): Observable<HttpResponse<User[]>> {
		return this.http.get<User[]>(`${this.uri}/users/${username}`, { observe: 'response' });
	}

	addUser(username, email, password) {
		const defaultProfilePic = 'https://secure.gravatar.com/avatar/755ba87e0a9949e846b042a8ac44723e?s=600&d=mm&r=g';
		const user = {
			username: username,
			email: email,
			password: password,
			image: defaultProfilePic,
			profile: {
				type: 'n/a',
				level: 'n/a',
				bio: ''
			}
		};
		return this.http.post(`${this.uri}/users/add`, user, { observe: 'response' });
	}

	updateUser(username, email, password, bio, image, interests, friends, pendingF, fandoms, subscribed) {
		const user = {
			username: username,
			email: email,
			password: password,
			profile: {
				bio: bio,
				interests: interests,
				friends: friends,
				pending_friends: pendingF,
				fandoms: fandoms,
				subscribed: subscribed
			},
			image: image
		};
		return this.http.post(`${this.uri}/users/update/${username}`, user, {observe: 'response'});
	}

	addPending(username, friend) {
		return this.http.post(`${this.uri}/users/addPending/${username}`, {friend: friend}, {observe: 'response'});
	}

	removePending(username, friend) {
		return this.http.post(`${this.uri}/users/removePending/${username}`, {friend: friend}, {observe: 'response'});
	}

	addFriend(username, friend) {
		return this.http.post(`${this.uri}/users/addfriend/${username}`, {friend: friend}, {observe: 'response'});
	}

	removeFriend(username, friend) {
		return this.http.post(`${this.uri}/users/unfriend/${username}`, {friend: friend}, {observe: 'response'});
	}

	// deleteUser(username) {
	// 	return this.http.delete(`${this.uri}/users/delete/${username}`);
	// }

	subscribe(username, fandom) {
		return this.http.post(`${this.uri}/users/subscribe/${username}`, {fandom: fandom}, {observe: 'response'});
	}

	unsubscribe(username, fandom) {
		return this.http.post(`${this.uri}/users/unsubscribe/${username}`, {fandom: fandom}, {observe: 'response'});
	}
}
