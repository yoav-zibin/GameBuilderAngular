import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdListModule, MdSelectModule, MdSnackBarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from '../../auth/auth.service';
import { ImageSelectionService } from '../../image-select/imageSelection.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { SelectSpecComponent } from './select-spec.component';
import firebaseConfig from '../../../config.js'

describe('SelectSpecComponent', () => {
  let component: SelectSpecComponent;
  let fixture: ComponentFixture<SelectSpecComponent>;
  let service: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSpecComponent ],
      imports: [
        //RouterTestingModule
        // .withRoutes([{path: '', redirectTo: '/', pathMatch: 'full'}]),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        MdListModule,
        MdSelectModule,
        MdSnackBarModule,
        FormsModule,
      ],
      providers: [
        AuthService,
        { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); }},
        ImageSelectionService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(inject([AuthService], s => {
    service = s;
    fixture = TestBed.createComponent(SelectSpecComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
