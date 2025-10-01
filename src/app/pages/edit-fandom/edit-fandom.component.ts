import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../user.service';
import { FandomService } from '../../fandom.service';

@Component({
	selector: 'app-edit-fandom',
	templateUrl: './edit-fandom.component.html',
	styleUrls: ['./edit-fandom.component.scss']
})
export class EditFandomComponent implements OnInit {

	image = '';
	name = '';
	desc = '';

	constructor(private fandomService: FandomService, private route: ActivatedRoute, private router: Router) { }

	ngOnInit() {
		this.name = this.route.snapshot.queryParamMap.get('fandom');
		this.fandomService.getFandom(this.name).subscribe(
			res => {
				console.log(res.body);
				(document.getElementById('title') as HTMLInputElement).value = res.body[0].name;
				(document.getElementById('image') as HTMLInputElement).value = res.body[0].image;
				(document.getElementById('description') as HTMLInputElement).value = res.body[0].description;
			},
			err => {
				console.log(err);
			}
		);
	}

	saveChanges(name, image, desc) {
		if (name == '') { name = this.name; }
		this.fandomService.updateFandom(name, image, desc).subscribe(
			res => {
				console.log(res.body);
				this.router.navigate(['/fandom-page'], {queryParams: {fandom: name, sort:'popularity'}});
			},
			err => {console.log(err); }
		);
	}

}
