import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasViewerComponent } from './canvas-viewer.component';

describe('CanvasViewerComponent', () => {
  let component: CanvasViewerComponent;
  let fixture: ComponentFixture<CanvasViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
