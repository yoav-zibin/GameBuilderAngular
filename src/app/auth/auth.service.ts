import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import constants from '../../constants.js'

@Injectable()
export class AuthService {

  private authState: any = null;

  constructor(
    private afAuth: AngularFireAuth,
    public db: AngularFireDatabase, 
    private router: Router)
    {
      this.afAuth.authState.subscribe((auth) => {
        this.authState = auth;
    });
  }

  createUserInfo(user: any) {
    let userInfo = {
        "publicFields": {
            "avatarImageUrl": (user.photoURL || constants.DEFAULT_AVATAR),
            "displayName":  (user.displayName || user.uid),
            "isConnected":  true,
            "lastSeen":  firebase.database.ServerValue.TIMESTAMP,
        },
        "privateFields" : {
            "email":  (user.email || ''),
            "createdOn":  firebase.database.ServerValue.TIMESTAMP,
            "phoneNumber": "",
            "facebookId": "",
            "googleId": user.email,
            "twitterId": "",
            "githubId": "",
            "friends": "",
            "pushNotificationsToken": "",
        }
     }
     return userInfo
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }
  
  get isAnonymous(): boolean {
    return (this.authState !== null) ? this.authState.isAnonymous : false
  }

  get currentUserId(): string {
    return (this.authState !== null) ? this.authState.uid : ''
  }

  get currentUserName(): string {
    return this.authState['email']
  }

  get currentUser(): any {
    return (this.authState !== null) ? this.authState : null;
  }

  get isUserEmailLoggedIn(): boolean {
    if ((this.authState !== null) && (!this.isAnonymous)) {
      return true
    } else {
      return false
    }
  }

  signUpWithEmail(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.authState = result
        console.log(result);
        this.db.database.ref('users/' + result.uid)
        .set(this.createUserInfo(result));
      })
      .catch(error => {
        // console.log(error)
        throw error
      });
  }

  loginWithEmail(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.authState = result
      })
      .catch(error => {
        // console.log(error)
        throw error
      });
  }

  loginWithGoogle() {
      this.afAuth.auth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider()
      ).then(result => {
          this.authState = result;
          let exists: boolean;
          let users = this.db.database.ref('users/' + result.user.uid);
          
          users.once('value', function(snapshot) {
            if (snapshot.exists()) {
              console.log('user exists');
              exists = true;
            }
            else {
              console.log("creating new user");
              exists = false;
            }
          }).then(temp => {
            if(exists){
              this.db.database
                .ref('users/' + this.authState.uid + '/publicFields')
                  .update(
                    {
                      isConnected: true,
                      lastSeen: firebase.database.ServerValue.TIMESTAMP
                    });
            }
            else {
              users.set(this.createUserInfo(this.authState));
            }
          });
    })
    .catch(error => {
        console.log(error)
        throw error
    });
  }

  loginAnonymously() {
        this.afAuth.auth.signInAnonymously();
        this.router.navigate(['']);
    }

  signOut(): void {
    if(!this.isAnonymous) {
      this.db.database
          .ref('users/' + this.authState.uid + '/publicFields')
              .update({isConnected: false});
    }
    this.afAuth.auth.signOut();
    this.authState = null;
    this.router.navigate([''])
  }
}
