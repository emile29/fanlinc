import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.scss']
})
export class TopnavbarComponent implements OnInit {
  title = 'Fanlinc';
    user = '';
    userImg = '';
    pendingNames = [];
    numPendings = 0;
    isShow = false;
    isDropdownOpen = false;

    constructor(private userService: UserService, private router: Router, private session: LocalStorageService) {}

    ngOnInit() {
      this.user = this.session.retrieve('logged-in');
      if (this.user != null && this.user != '') {
        this.isShow = !this.isShow;
        this.userService.getUserByUsername(this.user).subscribe(
          res => {
            this.numPendings = res.body[0].profile.pending_friends.length;
            for (let i = 0; i < res.body[0].profile.pending_friends.length; i++) {
              this.pendingNames.push(res.body[0].profile.pending_friends[i]);
            }
            this.userImg = res.body[0].image;
          },
          err => {
            console.log(err);
          }
        );
      }
    }

    navig() {
      if (this.user != null) {
        this.router.navigate(['/profile'], {queryParams: {user: this.user}}).then(() => window.location.reload());
      }
      else {
        alert('Sign in first');
        this.router.navigate(['/login']);
      }
    }

    toUserProfile(username) {
      this.router.navigate(['/profile'], {queryParams: {user: username, req: true}}).then(() => window.location.reload());
    }

    toPostsPg() {
      this.router.navigate(['/posts'], {queryParams: {sort: 'popularity'}});
    }

    addFriend(toBeAdded) {
        this.userService.addFriend(this.user, toBeAdded).subscribe(res => {console.log(res.body); }, err => {console.log(err); });
        this.userService.addFriend(toBeAdded, this.user).subscribe(res => {console.log(res.body); }, err => {console.log(err); });
        this.userService.removePending(this.user, toBeAdded).subscribe(res => {
        console.log(res.body);
        window.location.reload();
      },
      err => {console.log(err); });
    }

    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    }

    logout() {
      this.session.store('logged-in', '');
      this.router.navigate(['/login']).then(() => {window.location.reload(); });
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
}