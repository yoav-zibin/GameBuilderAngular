import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecEditorComponent } from './spec-editor.component';

describe('SpecEditorComponent', () => {
  let component: SpecEditorComponent;
  let fixture: ComponentFixture<SpecEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
