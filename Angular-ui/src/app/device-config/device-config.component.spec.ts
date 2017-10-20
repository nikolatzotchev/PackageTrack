import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceConfigComponent } from './device-config.component';

describe('TripConfigComponent', () => {
  let component: DeviceConfigComponent;
  let fixture: ComponentFixture<DeviceConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
