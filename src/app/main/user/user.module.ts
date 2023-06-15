import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { Role } from 'src/app/entities/role';
@NgModule({
  declarations: [ManageUserComponent ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'manage-user',
        component: ManageUserComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Admin,Role.Manage] },
      },
  ]),
  ]
})
export class UserModule { }
