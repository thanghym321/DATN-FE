import { MainComponent } from './main.component';
import { Routes } from '@angular/router';
import { RoleGuard } from '../core/guards/role.guard';
import { Role } from '../entities/role';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';
import { UnauthorizedComponent } from '../shared/components/unauthorized/unauthorized.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { DashboardComponent } from './manage/dashboard/dashboard.component';
export const MainRoutes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Admin,Role.Manage] },
      },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent,
      },
      {
        path: 'not-found',
        component: NotFoundComponent,
      },
      {
        path: 'user',
        loadChildren: () =>
        import('./user/user.module').then((m) => m.UserModule),
        canActivate: [RoleGuard],
        data: { roles: [Role.Admin]}
      },
      {
        path: 'manage',
        loadChildren: () =>
        import('./manage/manage.module').then((m) => m.ManageModule),
        canActivate: [RoleGuard],
        data: { roles: [Role.Admin,Role.Manage] },
      },
      {
        path: 'student',
        loadChildren: () =>
        import('./student/student.module').then((m) => m.StudentModule),
        canActivate: [AuthGuard]
      }
    ]
  }
];
