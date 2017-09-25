import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'GameBuilder';
	user: Observable<firebase.User>;

	constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase) {
		this.user = this.afAuth.authState;
	}

	login() {
    	this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
	}

	logout() {
    	this.afAuth.auth.signOut();
	}
}