import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DeviceViewComponent } from './device-view/device-view.component';

import { GMapModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    AppComponent,
    DeviceViewComponent
  ],
  imports: [
    // angular modules
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    // primeng modules
    GMapModule
  ],
  providers: [
      { provide: LocationStrategy, useClass: HashLocationStrategy } // othwise nging reload doesn't work
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
