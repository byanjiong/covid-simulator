import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorV1Component } from './simulator-v1.component';

describe('SimulatorV1Component', () => {
  let component: SimulatorV1Component;
  let fixture: ComponentFixture<SimulatorV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulatorV1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
