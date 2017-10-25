import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDeviceConfigComponent } from './set-device-config.component';

describe('SetDeviceConfigComponent', () => {
  let component: SetDeviceConfigComponent;
  let fixture: ComponentFixture<SetDeviceConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetDeviceConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDeviceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
