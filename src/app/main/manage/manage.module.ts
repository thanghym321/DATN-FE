import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CampusComponent } from './campus/campus.component';
import { BuildingComponent } from './building/building.component';
import { RoomComponent } from './room/room.component';
import { ElectricityWaterRateComponent } from './electricity-water-rate/electricity-water-rate.component';
import { MeterReadingComponent } from './meter-reading/meter-reading.component';
import { ServiceComponent } from './service/service.component';
import { RoomRegistrationComponent } from './room-registration/room-registration.component';
import { RoomInvoiceComponent } from './room-invoice/room-invoice.component';
import { WaitRoomRegistrationComponent } from './wait-room-registration/wait-room-registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    CampusComponent,
    BuildingComponent,
    RoomComponent,
    ElectricityWaterRateComponent,
    MeterReadingComponent,
    ServiceComponent,
    RoomRegistrationComponent,
    RoomInvoiceComponent,
    WaitRoomRegistrationComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'campus',
        component: CampusComponent,
      },
      {
        path: 'building',
        component: BuildingComponent,
      },
      {
        path: 'room',
        component: RoomComponent,
      },
      {
        path: 'electricity-water-rate',
        component: ElectricityWaterRateComponent,
      },
      {
        path: 'meter-reading',
        component: MeterReadingComponent,
      },
      {
        path: 'service',
        component: ServiceComponent,
      },
      {
        path: 'room-registration',
        component: RoomRegistrationComponent,
      },
      {
        path: 'room-invoice',
        component: RoomInvoiceComponent,
      },
      {
        path: 'wait-room-registration',
        component: WaitRoomRegistrationComponent,
      },
  ]),
  ]
})
export class ManageModule { }
