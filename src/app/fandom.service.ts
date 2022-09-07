import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class FandomService {

	uri = '';

	constructor(private http: HttpClient, private router: Router) {
		if (environment.production) {
			this.uri = '/api';
		} else {
			this.uri = 'http://localhost:8080/api';
		}
	}

	getAllFandoms() {
		return this.http.get(`${this.uri}/fandoms/`, { observe: 'response' });
	}

	getFandom(name) {
		return this.http.get(`${this.uri}/fandoms/${name}`, { observe: 'response' });
	}

	addFandom(name, desc, admin) {
		const fandom = {
			image: 'https://via.placeholder.com/100.jpg',
			name: name,
			description: desc,
			posts: [],
			subcount: 0,
			admin: admin,
			mods: [],
			events: []
		};
		return this.http.post(`${this.uri}/fandoms/add`, fandom, { observe: 'response' });
	}

	setSubCount(name, subcount) {
		return this.http.post(`${this.uri}/fandoms/setSubCount/${name}`, {subcount: subcount},  { observe: 'response' });
	}

	setPosts(post) {
		return this.http.post(`${this.uri}/fandoms/setPosts/${name}`, {newPost: post}, { observe: 'response' });
	}

	setMods(mod) {
		return this.http.post(`${this.uri}/fandoms/setMods/${name}`, {newMod: mod}, { observe: 'response' });
	}

	setEvents(event) {
		return this.http.post(`${this.uri}/fandoms/setEvents/${name}`, {newEvent: event}, { observe: 'response' });
	}

	updateFandom(name, image, desc) {
		const fandom = {
			image: image,
			name: name,
			description: desc
		};
		return this.http.post(`${this.uri}/fandoms/update/${name}`, fandom, { observe: 'response' });
	}

	deleteFandom(name) {
		return this.http.delete(`${this.uri}/fandoms/delete/${name}`, { observe: 'response' });
	}

}

