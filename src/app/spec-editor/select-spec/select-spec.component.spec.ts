import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSpecComponent } from './select-spec.component';

describe('SelectSpecComponent', () => {
  let component: SelectSpecComponent;
  let fixture: ComponentFixture<SelectSpecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSpecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
