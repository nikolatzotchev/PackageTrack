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

import { DeviceConfigComponent, DeleteDeviceDialogComponent } from './device-config/device-config.component';

import {CdkTableModule} from '@angular/cdk/table';

// primeng modules
import { GMapModule } from 'primeng/primeng';
import {InputTextModule} from 'primeng/primeng';
import {GrowlModule} from 'primeng/primeng';
import { SetDeviceDialogComponent } from './device-config/set-device-config/set-device-config.component';
import { TripComponent } from './trip/trip.component';
import { CreateTripComponent } from './trip/create-trip/create-trip.component';
import { StartTripComponent } from './trip/start-trip/start-trip.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';


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
    ConfirmDialogComponent
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
    // material modules
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    InputTextModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatStepperModule,
    MatSelectModule,
  ],
  entryComponents: [
    SetDeviceDialogComponent,
    DeleteDeviceDialogComponent,
    CreateTripComponent,
    StartTripComponent,
    ConfirmDialogComponent
  ],
  providers: [
      { provide: LocationStrategy, useClass: HashLocationStrategy } // othwise nging reload doesn't work
  ],
  bootstrap:  [AppComponent]
})
export class AppModule { }
