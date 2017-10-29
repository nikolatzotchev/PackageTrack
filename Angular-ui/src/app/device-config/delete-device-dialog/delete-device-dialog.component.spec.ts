import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDeviceDialogComponent } from './delete-device-dialog.component';

describe('DeleteDeviceDialogComponent', () => {
  let component: DeleteDeviceDialogComponent;
  let fixture: ComponentFixture<DeleteDeviceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteDeviceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDeviceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
