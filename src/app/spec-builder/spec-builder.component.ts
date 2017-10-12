import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import constants from '../../constants.js'



@Component({
  selector: 'app-spec-builder',
  template: `<app-progress-bar></app-progress-bar>`,
  styleUrls: ['./spec-builder.component.css']
})
export class SpecBuilderComponent implements OnInit {

	constructor(
		private auth: AuthService,
		private router: Router,
	) {	}

	ngOnInit() {
		/*
		if(!this.auth.authenticated) {
			alert("You need to login!")
			this.router.navigate(['']);
		}
		*/
	}

}
