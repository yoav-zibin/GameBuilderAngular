import {Injectable} from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import constants from '../../constants.js'

@Injectable()
export class AuthService {

  public _authState: Observable<firebase.User>;
  private _user: firebase.User = null;

  constructor(
    private afAuth: AngularFireAuth,
    public db: AngularFireDatabase, 
  )
    {
      this._authState = this.afAuth.authState;
      this._authState.subscribe((auth) => {
        this._user = auth;
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

  get authState(): any {
    return this._authState;
  }

  get authenticated(): boolean {
    return this._user !== null;
  }
  
  get isAnonymous(): boolean {
    return (this._user !== null) ? this._user.isAnonymous : false
  }

  get currentUserId(): string {
    return (this._user !== null) ? this._user.uid : ''
  }

  get currentUserName(): string {
    return this._user['email']
  }

  get currentUser(): any {
    return (this._user !== null) ? this._user : null;
  }

  get isUserEmailLoggedIn(): boolean {
    if ((this._user !== null) && (!this.isAnonymous)) {
      return true
    } else {
      return false
    }
  }

  signUpWithEmail(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this._user = result
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
        this._user = result
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
          this._user = result;
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
                .ref('users/' + this._user.uid + '/publicFields')
                  .update(
                    {
                      isConnected: true,
                      lastSeen: firebase.database.ServerValue.TIMESTAMP
                    });
            }
            else {
              users.set(this.createUserInfo(this._user));
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
  }

  signOut(): void {
    if(!this.isAnonymous) {
      this.db.database
          .ref('users/' + this._user.uid + '/publicFields')
              .update({isConnected: false});
    }
    this.afAuth.auth.signOut();
    this._user = null;
  }
}
