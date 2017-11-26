import { TestBed, async, inject } from '@angular/core/testing';
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service'
import { RouterTestingModule } from '@angular/router/testing';
import {Router, Routes} from "@angular/router";

const firebaseConfig = { 
    apiKey: "AIzaSyDA5tCzxNzykHgaSv1640GanShQze3UK-M",
    authDomain: "universalgamemaker.firebaseapp.com",
    databaseURL: "https://universalgamemaker.firebaseio.com",
    projectId: "universalgamemaker",
    storageBucket: "universalgamemaker.appspot.com",
    messagingSenderId: "144595629077"
};

const appRoutes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
];


describe('AppComponent', () => {
  let fixture, app, debug, service, router;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule.withRoutes(appRoutes),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
      ],
      providers: [AuthService],
    }).compileComponents();
  }));

  beforeEach(inject([AuthService], s => {
    service = s;
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    debug = fixture.debugElement;
    router = TestBed.get(Router);
  }));


  it('should create the app', (done) => {
    expect(app).toBeTruthy();
    done();
  });

  it(`should have as title 'GameBuilder'`, (done) => {
    expect(app.title).toEqual('GameBuilder');
    done();
  });

  
  it('should display login if not logged in', async(() => {
    fixture.detectChanges();
    expect(debug.nativeElement.querySelector('#login').textContent)
      .toMatch('Login');
  }));


  it('should display logout if not logged in', async(() => {
    app.user.subscribe(x => {
        expect(x.isAnonymous).toBeTruthy();
    });    
    
    expect(app.user.isAnonymous).toBeFalsy();
    service.loginAnonymously();
    fixture.detectChanges();
    
    fixture.whenStable().then(() => {
      expect(service.authenticated).toBeTruthy();
      router.navigate(['']);
    });

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(debug.nativeElement.querySelector('#logout').textContent)
        .toMatch('Logout');
    });
    
  }));

});
