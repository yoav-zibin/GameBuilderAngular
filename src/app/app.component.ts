import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { WindowService } from './window.service';
import * as firebase from 'firebase/app';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'GameBuilder';
	user: Observable<firebase.User>;

	constructor(
		public auth: AuthService,
		public afAuth: AngularFireAuth,
		public af: AngularFireDatabase, 
		private router: Router,
		){
		this.user = this.afAuth.authState;
	}
	
	build() {
		this.router.navigate(['/build']);
	}

	createElement() {
		this.router.navigate(['/createElement']);
	}

	loginAnonymously() {
		this.auth.loginAnonymously();
	}

	loginWithEmail() {
		this.router.navigate(['/login']);
	}

	loginWithGoogle() {
		this.router.navigate(['/googleLogin']);
	}

	loginWithPhoneNumber() {
		this.router.navigate(['/phonelogin']);
	}

	logout() {
		this.auth.signOut();
	}

	uploadImage() {
		this.router.navigate(['/uploadImage']);
	}
}