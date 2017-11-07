import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceViewComponent } from './device-view/device-view.component';
import { DeviceDisplayComponent } from './devices-display/devices-display.component';
import {DeviceInfoComponent} from './device-info/device-info.component';


const routes: Routes = [
  { path: '', redirectTo: 'devices-display', pathMatch: 'full' },
  {path: 'device-info/:deviceId', component: DeviceInfoComponent},
  { path: 'devices-display', component: DeviceDisplayComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
