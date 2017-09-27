import { Component, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { WindowService } from '../window.service';
import * as firebase from 'firebase/app';

export class PhoneNumber {
	country: string;
	area: string;
	prefix: string;
	line: string;

	get e164() {
		const num = this.country + this.area + this.prefix + this.line
		return '+${num}'
	}
}

@Component({
  selector: 'app-phonelogin',
  templateUrl: './phonelogin.component.html',
  styleUrls: ['./phonelogin.component.css']
})
export class PhoneloginComponent implements OnInit {
    windowRef: any;
    phoneNumber = new PhoneNumber()
    verificationCode: string;
    user: Observable<firebase.User>;

  constructor(private win: WindowService) { }

  ngOnInit() {
      this.windowRef = this.win.windowRef
      this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
      this.windowRef.recaptchaVerifier.render()
  }

  sendLoginCode() {
      const appVerifier = this.windowRef.recaptchaVerifier;
      const num = this.phoneNumber.e164;
      firebase.auth().signInWithPhoneNumber(num, appVerifier)
          .then(result => {
              this.windowRef.confirmationResult = result;
          })
          .catch(error => console.log(error));
    }

    verifyLoginCode() {
      this.windowRef.confirmationResult
          .confirm(this.verificationCode)
          .then(result => {
              this.user = result.user;
          })
          .catch(error => console.log(error, "Incorrect code."));
    }
}
