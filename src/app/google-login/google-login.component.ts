import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.css']
})
export class GoogleLoginComponent implements OnInit {
	user: Observable<firebase.User>;

	constructor(
		public afAuth: AngularFireAuth, 
		public af: AngularFireDatabase, 
		private router: Router,
	) {
		this.user = this.afAuth.authState;
	}

	ngOnInit() {
		this.login()
	}

	login() {
    	this.afAuth.auth.signInWithPopup(
    		new firebase.auth.GoogleAuthProvider()
    	).then(result => {
        	this.user = result.user;
            this.af.database.ref('users/' + result.user.uid + '/publicFields')
            	.set({
            		avatarImageUrl: (result.user.photoURL || ''),
          			displayName: (result.user.displayName || '')
				});
			this.af.database.ref('users/' + result.user.uid + '/privateFields')
            	.set({email: result.user.email});
		})
	}
}
