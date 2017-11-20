import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import constants from '../../constants.js';

@Component({
  selector: 'app-spec-viewer',
  templateUrl: './spec-viewer.component.html',
  styleUrls: ['./spec-viewer.component.css']
})
export class SpecViewerComponent implements OnInit {
	
	specs: FirebaseListObservable<any[]>;
	spec: Object;
	blocked: boolean;
	currentSpec: string;

	constructor(
		private auth: AuthService, 
		private db: AngularFireDatabase
	) {
  		if(this.auth.authenticated) {
  			console.log('got here');

			this.specs = db.list(constants.SPECS_PATH);
		}
	}

	ngOnInit() {
		this.blocked = this.auth.isAnonymous || !this.auth.authenticated;
	}

	onChange(value) {
		this.currentSpec = value;
		console.log(this.currentSpec);

		this.db.object(constants.SPECS_PATH + '/' + value, {
			preserveSnapshot: true
		})
		.subscribe(snap => {
			this.spec = snap.val();
		});

		console.log(this.spec);

	}


}
