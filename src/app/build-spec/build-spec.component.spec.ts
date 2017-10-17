import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildSpecComponent } from './build-spec.component';

describe('BuildSpecComponent', () => {
  let component: BuildSpecComponent;
  let fixture: ComponentFixture<BuildSpecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildSpecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
