import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-google-login',
  template: ``
})
export class GoogleLoginComponent implements OnInit {

	constructor(
		public auth: AuthService,
		private router: Router,
	) {}

	ngOnInit() {
		this.auth.loginWithGoogle();
		this.router.navigate(['/']);
	}
}
