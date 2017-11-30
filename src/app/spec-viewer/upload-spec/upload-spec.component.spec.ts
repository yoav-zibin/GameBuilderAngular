import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSpecComponent } from './upload-spec.component';

describe('UploadSpecComponent', () => {
  let component: UploadSpecComponent;
  let fixture: ComponentFixture<UploadSpecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadSpecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
