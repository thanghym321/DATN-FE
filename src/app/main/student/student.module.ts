import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListRoomInvoiceComponent } from './list-room-invoice/list-room-invoice.component';
import { WaitRoomInvoiceComponent } from './wait-room-invoice/wait-room-invoice.component';
import { ListRoomRegistrationComponent } from './list-room-registration/list-room-registration.component';
import { SearchRoomComponent } from './search-room/search-room.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { RoomInfomationComponent } from './room-infomation/room-infomation.component';


@NgModule({
  declarations: [ListRoomRegistrationComponent,
     ListRoomInvoiceComponent,
      WaitRoomInvoiceComponent,
      SearchRoomComponent,
       StudentProfileComponent,
        RoomInfomationComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'search-room',
        component: SearchRoomComponent,
      },
      {
        path: 'list-room-registration',
        component: ListRoomRegistrationComponent,
      },
      {
        path: 'list-room-invoice',
        component: ListRoomInvoiceComponent,
      },
      {
        path: 'wait-room-invoice',
        component: WaitRoomInvoiceComponent,
      },
      {
        path: 'student-profile',
        component: StudentProfileComponent,
      },
      {
        path: 'room-information',
        component: RoomInfomationComponent,
      },
  ]),
  ]
})
export class StudentModule { }
