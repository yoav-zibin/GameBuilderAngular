import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { WindowService } from './window.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'GameBuilder';
	user: Observable<firebase.User>;

	constructor(
		public afAuth: AngularFireAuth, 
		public af: AngularFireDatabase, 
		private router: Router,
		){
		this.user = this.afAuth.authState;
	}

	loginWithGoogle() {
		this.router.navigate(['/googleLogin']);
	}

	loginWithPhoneNumber() {
		this.router.navigate(['/phonelogin']);
	}

	loginAnonymously() {
		this.afAuth.auth.signInAnonymously();
	}

	logout() {
		this.afAuth.auth.signOut();
		this.router.navigate(['']);
	}
}