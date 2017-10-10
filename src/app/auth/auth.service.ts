import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {

  authState: any = null;

  constructor(
    private afAuth: AngularFireAuth,
    public db: AngularFireDatabase, 
    private router: Router)
    {
      this.afAuth.authState.subscribe((auth) => {
        this.authState = auth;
      });
  }

  createUserInfo(result: any) {
    let userInfo = {
        "publicFields": {
            "avatarImageUrl": (result.user.photoURL || ''),
            "displayName":  (result.user.displayName || ''),
            "isConnected":  true,
            "lastSeen":  firebase.database.ServerValue.TIMESTAMP,
        },
        "privateFields" : {
            "email":  result.user.email,
            "createdOn":  firebase.database.ServerValue.TIMESTAMP,
        }
     }
     return userInfo
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }
  
  get isUserAnonymousLoggedIn(): boolean {
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
    if ((this.authState !== null) && (!this.isUserAnonymousLoggedIn)) {
      return true
    } else {
      return false
    }
  }

  signUpWithEmail(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user
      })
      .catch(error => {
        console.log(error)
        throw error
      });
  }

  loginWithEmail(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user
      })
      .catch(error => {
        console.log(error)
        throw error
      });
  }

  loginWithGoogle() {
      this.afAuth.auth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider()
      ).then(result => {
          this.authState = result;
          this.db.database.ref('users/' + result.user.uid)
              .set(this.createUserInfo(result));
    })
  }

  loginAnonymously() {
        this.afAuth.auth.signInAnonymously();
        this.router.navigate(['']);
    }

  signOut(): void {
    if(!this.isUserAnonymousLoggedIn) {
      this.db.database
          .ref('users/' + this.authState.uid + '/publicFields')
              .update({isConnected: false});
    }
    this.afAuth.auth.signOut();
    this.authState = null;
    this.router.navigate([''])
  }
}
