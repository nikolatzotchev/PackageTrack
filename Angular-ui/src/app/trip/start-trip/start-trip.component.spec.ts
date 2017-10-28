import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartTripComponent } from './start-trip.component';

describe('StartTripComponent', () => {
  let component: StartTripComponent;
  let fixture: ComponentFixture<StartTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
