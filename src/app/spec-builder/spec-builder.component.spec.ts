import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecBuilderComponent } from './spec-builder.component';

describe('SpecBuilderComponent', () => {
  let component: SpecBuilderComponent;
  let fixture: ComponentFixture<SpecBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
