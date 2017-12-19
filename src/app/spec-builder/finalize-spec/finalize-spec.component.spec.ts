import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdGridListModule, MdSelectModule, MdSnackBarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { FinalizeSpecComponent } from './finalize-spec.component';
import firebaseConfig from '../../../config.js'

describe('FinalizeSpecComponent', () => {
  let component: FinalizeSpecComponent;
  let fixture: ComponentFixture<FinalizeSpecComponent>;
  let service: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalizeSpecComponent ],
      imports: [
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        MdSnackBarModule,
        //MdGridListModule,
        //MdSelectModule,
        //FormsModule,
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
    fixture = TestBed.createComponent(FinalizeSpecComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
