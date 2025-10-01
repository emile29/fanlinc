import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.scss']
})
export class TopnavbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // Add authentication check logic here
  }

  logout(): void {
    // Add logout logic here
  }
}