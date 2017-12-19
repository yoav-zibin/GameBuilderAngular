import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdStepperModule,  MdGridListModule, MdSelectModule,MdSnackBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from '../auth/auth.service';
import { KonvaService } from '../konva/konva.service';
import { ImageSelectionService } from '../image-select/imageSelection.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { SpecBuilderComponent } from './spec-builder.component';
import { BuildSpecComponent } from './build-spec/build-spec.component'
import { SelectBoardComponent } from './select-board/select-board.component'
import { FinalizeSpecComponent } from './finalize-spec/finalize-spec.component'
import firebaseConfig from '../../config.js'

describe('SpecBuilderComponent', () => {
  let component: SpecBuilderComponent;
  let fixture: ComponentFixture<SpecBuilderComponent>;
  let service: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpecBuilderComponent,
        SelectBoardComponent,
        FinalizeSpecComponent,
        BuildSpecComponent,
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
    fixture = TestBed.createComponent(SpecBuilderComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
