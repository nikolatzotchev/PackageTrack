import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule, Http} from '@angular/http';
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

import {TripComponent} from './trip/trip.component';
import {CreateTripComponent} from './trip/create-trip/create-trip.component';
import {ManageTripsComponent} from './trip/manage-trips/manage-trips.component';
import {DeviceDisplayComponent} from './devices-display/devices-display.component';
import {DeviceInfoComponent} from './device-info/device-info.component';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {DeviceViewComponent} from './device-view/device-view.component';



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
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule,
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
  entryComponents: [
    CreateTripComponent,
    ManageTripsComponent,
    TripComponent
  ],
  providers: [
    MessageService,
    {provide: LocationStrategy, useClass: HashLocationStrategy} // othwise nging reload doesn't work
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
