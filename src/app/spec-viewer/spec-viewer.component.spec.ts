import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecViewerComponent } from './spec-viewer.component';

describe('SpecViewerComponent', () => {
  let component: SpecViewerComponent;
  let fixture: ComponentFixture<SpecViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
