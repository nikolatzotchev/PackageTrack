import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevicesComponent } from './devices/devices.component';
import { TripsComponent } from './trips/trips.component';
import { TripsViewComponent } from './trips/trips-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'devices', pathMatch: 'full' },
  { path: 'devices', component: DevicesComponent },
  { path: 'devices/:deviceId', component: TripsComponent },
  { path: 'trips/:tripId', component: TripsViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
