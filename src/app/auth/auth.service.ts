import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

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

  createUserInfo(result: any) {

    let userInfo = {
        "publicFields": {
            "avatarImageUrl": (result.user.photoURL || ''),
            "displayName":  (result.user.displayName || ''),
            "isConnected":  true,
            "lastSeen":  firebase.database.ServerValue.TIMESTAMP,
        },
        "privateFields" : {
            "email":  (result.user.email || ''),
            "createdOn":  firebase.database.ServerValue.TIMESTAMP,
            "phoneNumber": "",
            "facebookId": "",
            "googleId": result.user.email,
            "twitterId": "",
            "githubId": "",
            "friends": "",
            "pushNotificationsToken": "",
        }
     }
     return userInfo
  }

  createUser(result: any) {
    
        let userInfo = {
          "publicFields": {
            "avatarImageUrl": "https://firebasestorage.googleapis.com/v0/b/universalgamemaker.appspot.com/o/images%2F-KwBrfAk0MiQ_s1jBS60.png?alt=media&token=d2f830bf-0b4b-48ca-a232-5a84e7433032",
            "displayName":  result.email,
            "isConnected":  true,
            "lastSeen":  firebase.database.ServerValue.TIMESTAMP,
        },
        "privateFields" : {
            "email": '',
            "createdOn":  firebase.database.ServerValue.TIMESTAMP,
            "phoneNumber": result.email,
            "facebookId": '',
            "googleId": '',
            "twitterId": '',
            "githubId": '',
            "pushNotificationsToken": '',
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
      .then((result) => {
        this.authState = result
        console.log(result);
        this.db.database.ref('users/' + result.uid)
        .set(this.createUser(result));
      })
      .catch(error => {
        console.log(error)
        throw error
      });
  }

  loginWithEmail(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.authState = result
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
          
          /*
          if(this.authenticated) {
            console.log('user exists!')
            this.db.database
              .ref('users/' + result.user.uid + '/publicFields')
                .update(
                  {
                    isConnected: true,
                    lastSeen: firebase.database.ServerValue.TIMESTAMP
                  });
          }
          else {
            console.log('creating new user');
            this.db.database.ref('users/' + result.user.uid)
              .set(this.createUserInfo(result));
          }
          */
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
