import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service'
import { RouterTestingModule } from '@angular/router/testing';

const firebaseConfig = { 
    apiKey: "AIzaSyDA5tCzxNzykHgaSv1640GanShQze3UK-M",
    authDomain: "universalgamemaker.firebaseapp.com",
    databaseURL: "https://universalgamemaker.firebaseio.com",
    projectId: "universalgamemaker",
    storageBucket: "universalgamemaker.appspot.com",
    messagingSenderId: "144595629077"
};


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
      ],
      providers: [AuthService],
    }).compileComponents();
  }));

  it('should create the app', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
    done();
  });

  it(`should have as title 'GameBuilder'`, (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('GameBuilder');
    done();
  });

  
  it('should display login if not logged in', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#login').textContent).toMatch('Login');
  }));

  it('should display logout if not logged in', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    /*
    ** get anon login link; click, then check if logout button visible
    */
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#logout').textContent).toMatch('Logout');
  }));
});
