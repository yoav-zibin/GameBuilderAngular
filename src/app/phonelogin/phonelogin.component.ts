import { Component, NgModule, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
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
		const num = this.country + this.area + this.prefix + this.line;
		return '+' + num;
	}
}

@Component({
    selector: 'app-phonelogin',
    providers: [WindowService],
    templateUrl: './phonelogin.component.html',
    styleUrls: ['./phonelogin.component.css']
})
export class PhoneloginComponent implements OnInit {
    email: string;
    windowRef: any;
    phoneNumber = new PhoneNumber();
    showPhoneLogin: boolean;
    verificationCode: string;
    user: Observable<firebase.User>;

    constructor(
        public afAuth: AngularFireAuth, 
        public af: AngularFireDatabase, 
        private win: WindowService
    ) { }

    ngOnInit() {
        this.showPhoneLogin = false;
    }

    validateEmail() {
        if (this.email.match(new RegExp("[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}", 'i'))) {
            this.windowRef = this.win.windowRef;
            this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
            this.windowRef.recaptchaVerifier.render();    
            this.showPhoneLogin = true;  
        } else {
            this.email = "";
            window.alert("Please enter the correct email.");       
        }
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
                result.user.updateEmail(this.email)
                .then(() => {
                    this.user = result.user;
                    let userInfo = this.createUserInfo(result);
                    this.af.database.ref('users/' + result.user.uid).update(userInfo);
                    console.log(userInfo);
                }).catch(error => {
                    console.log(error);
                    window.alert("Email is already used by another Google or email account.");
                })
          }).catch(error => window.alert("Incorrect code."));
    }

    createUserInfo(result: any) {
        let userInfo = {
            "publicFields": {
                "avatarImageUrl": "https://firebasestorage.googleapis.com/v0/b/universalgamemaker.appspot.com/o/images%2F-KwBrfAk0MiQ_s1jBS60.png?alt=media&token=d2f830bf-0b4b-48ca-a232-5a84e7433032",
                "displayName":  result.user.phoneNumber,
                "isConnected":  true,
                "lastSeen":  firebase.database.ServerValue.TIMESTAMP,
            },
            "privateFields" : {
                "email": result.user.email,
                "createdOn":  firebase.database.ServerValue.TIMESTAMP,
                "phone_number": result.user.phoneNumber,
                "facebookId": '',
                "googleId": '',
                "twitterId": '',
                "githubId": '',
                "pushNotificationsToken": ''
            }
         }
         return userInfo
    }
}
