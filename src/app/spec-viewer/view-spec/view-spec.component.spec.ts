import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSpecComponent } from './view-spec.component';

describe('ViewSpecComponent', () => {
  let component: ViewSpecComponent;
  let fixture: ComponentFixture<ViewSpecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSpecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
