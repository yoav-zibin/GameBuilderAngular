import { TestBed, inject, async } from '@angular/core/testing';
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './auth.service';

const firebaseConfig = { 
    apiKey: "AIzaSyDA5tCzxNzykHgaSv1640GanShQze3UK-M",
    authDomain: "universalgamemaker.firebaseapp.com",
    databaseURL: "https://universalgamemaker.firebaseio.com",
    projectId: "universalgamemaker",
    storageBucket: "universalgamemaker.appspot.com",
    messagingSenderId: "144595629077"
};

describe('AuthService', () => {
	let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
			imports: [
		    AngularFireModule.initializeApp(firebaseConfig),
		    AngularFireDatabaseModule,
		    AngularFireAuthModule,
		  ],
      providers: [AuthService]
    });
  });

  beforeEach(inject([AuthService], s => {
    service = s;
  }));

  it('should be created', (done) => {
    expect(service).toBeTruthy();
    done();
  });

  it('should return false if not authenticated', async(() => {
  	expect(service.authenticated).toBeFalsy();
  }));

  it('should return true if authenticated', async(() => {
  	service.authState.subscribe(x => {
        expect(x).toBeTruthy();
    }); 
  	
  	expect(service.authenticated).toBeFalsy();
  	service.loginAnonymously();
  }));

});