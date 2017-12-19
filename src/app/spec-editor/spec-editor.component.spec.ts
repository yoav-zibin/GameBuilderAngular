import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdStepperModule,  MdGridListModule, MdSelectModule, MdSnackBarModule, MdListModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from '../auth/auth.service';
import { KonvaService } from '../konva/konva.service';
import { ImageSelectionService } from '../image-select/imageSelection.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { SpecEditorComponent } from './spec-editor.component';
import { SelectSpecComponent } from './select-spec/select-spec.component'
import { BuildSpecComponent } from '../spec-builder/build-spec/build-spec.component'
import { FinalizeSpecComponent } from '../spec-builder/finalize-spec/finalize-spec.component'
import firebaseConfig from '../../config.js'

describe('SpecEditorComponent', () => {
  let component: SpecEditorComponent;
  let fixture: ComponentFixture<SpecEditorComponent>;
  let service: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpecEditorComponent,
        BuildSpecComponent,
        FinalizeSpecComponent,
        SelectSpecComponent,
      ],
      imports: [
        //RouterTestingModule
        // .withRoutes([{path: '', redirectTo: '/', pathMatch: 'full'}]),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        MdStepperModule,
        MdSelectModule,
        MdGridListModule,
        MdSnackBarModule,
        MdListModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        AuthService,
        { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); }},
        ImageSelectionService,
        KonvaService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(inject([AuthService], s => {
    service = s;
    fixture = TestBed.createComponent(SpecEditorComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
