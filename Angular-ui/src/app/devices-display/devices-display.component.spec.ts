import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDisplayComponent } from './devices-display.component';

describe('DeviceDisplayComponent', () => {
  let component: DeviceDisplayComponent;
  let fixture: ComponentFixture<DeviceDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
