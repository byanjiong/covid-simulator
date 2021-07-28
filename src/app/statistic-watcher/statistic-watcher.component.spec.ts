import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticWatcherComponent } from './statistic-watcher.component';

describe('StatisticWatcherComponent', () => {
  let component: StatisticWatcherComponent;
  let fixture: ComponentFixture<StatisticWatcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticWatcherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticWatcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
