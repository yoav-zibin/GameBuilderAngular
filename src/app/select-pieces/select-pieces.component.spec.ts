import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPiecesComponent } from './select-pieces.component';

describe('SelectPiecesComponent', () => {
  let component: SelectPiecesComponent;
  let fixture: ComponentFixture<SelectPiecesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPiecesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPiecesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
