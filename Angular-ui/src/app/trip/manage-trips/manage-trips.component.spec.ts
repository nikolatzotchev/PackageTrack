import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTripsComponent } from './manage-trips.component';

describe('ManageTripsComponent', () => {
  let component: ManageTripsComponent;
  let fixture: ComponentFixture<ManageTripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTripsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
