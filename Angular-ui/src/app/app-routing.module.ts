import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceViewComponent } from './device-view/device-view.component';


const routes: Routes = [
  { path: '', redirectTo: 'device-view', pathMatch: 'full' },
  { path: 'device-view', component: DeviceViewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
