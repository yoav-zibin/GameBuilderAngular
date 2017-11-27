import { TestBed, inject, async } from '@angular/core/testing';
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './auth.service';
import firebaseConfig from '../../config.js';

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

  it('should return true if authenticated', (done) => {
  	expect(service.authenticated).toBeFalsy();
  	service.loginAnonymously();

    service.authState.subscribe(x => {
      expect(x).toBeTruthy();
    });
    done(); 
  });

});