import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidenavService } from '../../services/sidenav.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrls: ['./sidenavbar.component.scss']
})
export class SidenavbarComponent implements OnInit, OnDestroy {
  isOpen = false;
  private sub: Subscription;

  constructor(private sidenavService: SidenavService, private router: Router, private session: LocalStorageService) { }

  ngOnInit(): void {
    this.sub = this.sidenavService.open$.subscribe(v => this.isOpen = v);
  }

  close() {
    this.sidenavService.close();
  }

  toNewPost() {
    const user = this.session.retrieve('logged-in');
    if (user != null && user !== '') {
      this.router.navigate(['/create-new-post']);
      this.close();
    } else {
      if (confirm('Sign in first!!')) {
        this.router.navigate(['/login']);
      }
    }
  }

  toNewFandom() {
    const user = this.session.retrieve('logged-in');
    if (user != null && user !== '') {
      this.router.navigate(['/create-new-fandom']);
      this.close();
    } else {
      if (confirm('Sign in first!!')) {
        this.router.navigate(['/login']);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.sub) { this.sub.unsubscribe(); }
  }

}