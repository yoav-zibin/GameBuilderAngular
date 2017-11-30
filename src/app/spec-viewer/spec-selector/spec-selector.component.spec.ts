import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecSelectorComponent } from './spec-selector.component';

describe('SpecSelectorComponent', () => {
  let component: SpecSelectorComponent;
  let fixture: ComponentFixture<SpecSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
