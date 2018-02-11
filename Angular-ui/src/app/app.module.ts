import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

// primeng modules
import {MessageService} from 'primeng/components/common/messageservice';

import {
  GMapModule,
  InputTextModule,
  GrowlModule,
  ProgressBarModule,
  DataGridModule,
  PanelModule,
  ButtonModule,
  DialogModule,
  ProgressSpinnerModule,
  BreadcrumbModule,
  InputTextareaModule,
  TooltipModule,
  CheckboxModule,
  SliderModule,
  AccordionModule,
  TabViewModule,
  DataTableModule,
  SharedModule
} from 'primeng/primeng';

// components
import {TripComponent} from './trip/trip.component';
import {CreateTripComponent} from './trip/create-trip/create-trip.component';
import {ManageTripsComponent} from './trip/manage-trips/manage-trips.component';
import {DeviceDisplayComponent} from './devices-display/devices-display.component';
import {DeviceInfoComponent} from './device-info/device-info.component';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {DeviceViewComponent} from './device-view/device-view.component';

// services
import {ErrorService} from './services/error.service';
import {DeviceService} from './services/device/device.service';
import {TripService} from './services/trip/trip.service';


@NgModule({
  declarations: [
    AppComponent,
    DeviceViewComponent,
    // device components
    TripComponent,
    CreateTripComponent,
    ManageTripsComponent,
    DeviceDisplayComponent,
    DeviceInfoComponent,
    BreadcrumbComponent
  ],
  imports: [
    // angular modules
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    // primeng modules
    GMapModule,
    GrowlModule,
    ProgressBarModule,
    DataGridModule,
    PanelModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ProgressSpinnerModule,
    BreadcrumbModule,
    TooltipModule,
    InputTextareaModule,
    CheckboxModule,
    SliderModule,
    AccordionModule,
    TabViewModule,
    DataTableModule,
    SharedModule,
  ],
  providers: [
      MessageService,
      DeviceService,
      TripService,
      { provide: HTTP_INTERCEPTORS, useClass: ErrorService, multi: true },
      { provide: LocationStrategy, useClass: HashLocationStrategy} // othwise nging reload doesn't work
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
