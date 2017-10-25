import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteDeviceComponent } from './confirm-delete-device.component';

describe('ConfirmDeleteDeviceComponent', () => {
  let component: ConfirmDeleteDeviceComponent;
  let fixture: ComponentFixture<ConfirmDeleteDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
