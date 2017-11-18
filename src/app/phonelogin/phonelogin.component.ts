import { Component, NgModule, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { WindowService } from '../window.service';
import * as firebase from 'firebase/app';

@Component({
    selector: 'app-phonelogin',
    providers: [WindowService],
    templateUrl: './phonelogin.component.html',
    styleUrls: ['./phonelogin.component.css']
})
export class PhoneloginComponent implements OnInit {
    windowRef: any;
    phoneNumber: string;
    sendSMS: boolean = false;
    verificationCode: string;
    user: Observable<firebase.User>;

    constructor(
        public afAuth: AngularFireAuth, 
        public af: AngularFireDatabase, 
        private win: WindowService
    ) { }

    ngOnInit() {
        this.windowRef = this.win.windowRef
        this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible'
        })
        //this.windowRef.recaptchaVerifier.render()
    }

    /*
        Do NOT delete this method!
        Will be moved and used in 'Profile Settings' functionality for user to add email.

    validateEmail() {
        if (this.email.match(new RegExp("[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}", 'i'))) {
            this.windowRef = this.win.windowRef;
            this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
            this.windowRef.recaptchaVerifier.render();  
        } else {
            this.email = "";
            window.alert("Please enter the correct email.");       
        }
    }
    */

    sendLoginCode() {
        this.sendSMS = true;
        firebase.auth().signInWithPhoneNumber("+1"+this.phoneNumber, this.windowRef.recaptchaVerifier)
            .then(result => {
                this.windowRef.confirmationResult = result;
            })
            .catch(error => {
                console.log(error);
                this.sendSMS = false;
                window.alert("Invalid phone number.");
            });
    }

    verifyLoginCode() {
      this.windowRef.confirmationResult
            .confirm(this.verificationCode)
            .then(result => {
                this.user = result.user;
                const users = this.af.database.ref(`users/${result.user.uid}`);
                const thisClass = this;
                users.once('value', function(snapshot) {
                    console.log(snapshot);
                    if (snapshot.exists()) {
                        console.log("user exists");
                        thisClass.af.database.ref(`users/${result.user.uid}/publicFields`)
                        .update({
                            isConnected: true,
                            lastSeen: firebase.database.ServerValue.TIMESTAMP
                        });
                    } else {
                        console.log("new user");
                        thisClass.af.database.ref(`users/${result.user.uid}`).update(thisClass.createUserInfo(result));
                    }
                });
            })
            .catch(error => window.alert("Incorrect code."));
    }

    createUserInfo(result: any) {
        const userInfo = {
            "publicFields": {
                "avatarImageUrl": "https://firebasestorage.googleapis.com/v0/b/universalgamemaker.appspot.com/o/images%2F-KwBrfAk0MiQ_s1jBS60.png?alt=media&token=d2f830bf-0b4b-48ca-a232-5a84e7433032",
                "displayName":  result.user.phoneNumber,
                "isConnected":  true,
                "lastSeen":  firebase.database.ServerValue.TIMESTAMP,
            },
            "privateFields" : {
                "email": '',
                "createdOn":  firebase.database.ServerValue.TIMESTAMP,
                "phoneNumber": result.user.phoneNumber,
                "facebookId": '',
                "googleId": '',
                "twitterId": '',
                "githubId": '',
            }
         }
         return userInfo;
    }
}
