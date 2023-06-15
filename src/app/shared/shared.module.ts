import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { StatusLabelPipe } from './pipes/statusLabel.pipe';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogComponent } from './components/Dialog/Dialog.component';

@NgModule({
  declarations: [
    SidebarComponent,
    FooterComponent,
    NavbarComponent,
    UnauthorizedComponent,
    NotFoundComponent,
    StatusLabelPipe,
    DialogComponent,
  ],
  exports: [
    SidebarComponent,
    FooterComponent,
    NavbarComponent,
    UnauthorizedComponent,
    NotFoundComponent,
    DialogComponent,
    StatusLabelPipe,
    CKEditorModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatDialogModule,
  ],
  imports: [
    CommonModule,
    RouterModule,
    CKEditorModule,
  ]
})
export class SharedModule { }
