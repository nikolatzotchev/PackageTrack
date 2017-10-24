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

import { DeviceConfigComponent, SetDeviceDialogComponent, DeleteDeviceDialogComponent } from './device-config/device-config.component';
import {ConfirmDeleteComponent} from './device-config/dialogs/device-dialog-config.component';

import {CdkTableModule} from '@angular/cdk/table';

// primeng modules
import { GMapModule } from 'primeng/primeng';
import {InputTextModule} from 'primeng/primeng';
import {GrowlModule} from 'primeng/primeng';


@NgModule({
  declarations: [
    AppComponent,
    DeviceViewComponent,
    // device components
    DeviceConfigComponent,
    SetDeviceDialogComponent,
    DeleteDeviceDialogComponent,
    ConfirmDeleteComponent
  ],
  imports: [
    // angular modules
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule,
    // primeng modules
    GMapModule,
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
    GrowlModule
  ],
  entryComponents: [SetDeviceDialogComponent, DeleteDeviceDialogComponent, ConfirmDeleteComponent],
  providers: [
      { provide: LocationStrategy, useClass: HashLocationStrategy } // othwise nging reload doesn't work
  ],
  bootstrap:  [AppComponent]
})
export class AppModule { }
