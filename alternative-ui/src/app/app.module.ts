import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpModule } from '@angular/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DevicesComponent } from './devices/devices.component';
import { TripsComponent } from './trips/trips.component';
import { ReportComponent } from './report/report.component';

// primeng
import { BreadcrumbModule, GrowlModule, ButtonModule, DialogModule,
    InputTextModule, DataTableModule, SharedModule, GMapModule
} from 'primeng/primeng';

import { MessageService } from 'primeng/components/common/messageservice';
import { TripsViewComponent } from './trips/trips-view.component';

@NgModule({
  declarations: [
    AppComponent,
    DevicesComponent,
    TripsComponent,
    ReportComponent,
    TripsViewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // angular
    HttpModule,
    // primeng
    SharedModule,
    DataTableModule,
    BreadcrumbModule,
    GrowlModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    GMapModule

  ],
  providers: [
      MessageService,
      { provide: LocationStrategy, useClass: HashLocationStrategy } // othwise nging reload doesn't work
  ],
  bootstrap: [AppComponent],
  exports: [DevicesComponent, TripsComponent, ReportComponent, TripsViewComponent]
})
export class AppModule { }
