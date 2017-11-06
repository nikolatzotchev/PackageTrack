import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DeviceViewComponent } from './device-view/device-view.component';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  MatFormFieldModule
} from '@angular/material';

import { DeviceConfigComponent} from './device-config/device-config.component';

import {CdkTableModule} from '@angular/cdk/table';

// primeng modules
import { GMapModule,
         InputTextModule,
         GrowlModule,
         ProgressBarModule,
         DataGridModule,
         PanelModule,
         ButtonModule,
         DialogModule,
         ProgressSpinnerModule,
         BreadcrumbModule,
         } from 'primeng/primeng';

import { MessageService } from 'primeng/components/common/messageservice';
import { SetDeviceDialogComponent } from './device-config/set-device-config/set-device-config.component';
import { TripComponent } from './trip/trip.component';
import { CreateTripComponent } from './trip/create-trip/create-trip.component';
import { StartTripComponent } from './trip/start-trip/start-trip.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DeleteDeviceDialogComponent} from './device-config/delete-device-dialog/delete-device-dialog.component';
import { ErrorHandlingComponent } from './error-handling/error-handling.component';
import { ManageTripsComponent } from './trip/manage-trips/manage-trips.component';
import { DeviceDisplayComponent } from './devices-display/devices-display.component';


@NgModule({
  declarations: [
    AppComponent,
    DeviceViewComponent,
    // device components
    DeviceConfigComponent,
    DeleteDeviceDialogComponent,
    SetDeviceDialogComponent,
    TripComponent,
    CreateTripComponent,
    StartTripComponent,
    ConfirmDialogComponent,
    ErrorHandlingComponent,
    ManageTripsComponent,
    DeviceDisplayComponent
  ],
  imports: [
    // angular modules
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule,
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
    // material modules
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatStepperModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  entryComponents: [
    SetDeviceDialogComponent,
    DeleteDeviceDialogComponent,
    CreateTripComponent,
    StartTripComponent,
    ConfirmDialogComponent,
    ErrorHandlingComponent,
    ManageTripsComponent
  ],
  providers: [
       MessageService,
      { provide: LocationStrategy, useClass: HashLocationStrategy } // othwise nging reload doesn't work
  ],
  bootstrap:  [AppComponent]
})
export class AppModule { }
