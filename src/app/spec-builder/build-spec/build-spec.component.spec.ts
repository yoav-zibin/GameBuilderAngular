import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdGridListModule, MdSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { BuildSpecComponent } from './build-spec.component';
import firebaseConfig from '../../../config.js'

describe('BuildSpecComponent', () => {
  let component: BuildSpecComponent;
  let fixture: ComponentFixture<BuildSpecComponent>;
  let service: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildSpecComponent ],
      imports: [
        //RouterTestingModule
        // .withRoutes([{path: '', redirectTo: '/', pathMatch: 'full'}]),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        MdGridListModule,
        MdSelectModule,
        FormsModule,
      ],
      providers: [
        AuthService,
        { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); }}
      ]
    })
    .compileComponents();
  }));

  beforeEach(inject([AuthService], s => {
    service = s;
    fixture = TestBed.createComponent(BuildSpecComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});