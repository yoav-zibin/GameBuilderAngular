import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizeSpecComponent } from './finalize-spec.component';

describe('FinalizeSpecComponent', () => {
  let component: FinalizeSpecComponent;
  let fixture: ComponentFixture<FinalizeSpecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalizeSpecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalizeSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
