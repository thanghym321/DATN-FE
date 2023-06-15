import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { timer } from 'rxjs';
import { BaseComponent } from '../core/common/base-component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent extends BaseComponent implements OnInit,AfterViewInit{

  frmResetPassword: FormGroup;

 constructor( injector: Injector) {
   super(injector);
 }

 ngAfterViewInit() {
   this.loadScripts('assets/js/core/app.js', 'assets/js/pages/dashboard.js');
 }

 ngOnInit(): void {
  this.frmResetPassword = new FormGroup({
    'txt_email': new FormControl('', [Validators.email]),

  });

 }

get email() {
  return this.frmResetPassword.get('txt_email')!;
}

OnSubmit() {
  debugger;
  this._api.get('/api/User/SendMailResetPassword?Email=' + this.frmResetPassword.value['txt_email']
  ).subscribe(res => {
    if (res==1) {
      alert("Kiểm tra email của bạn");
    }
    if (res==2) {
      alert("Không tồn tại người dùng có email này");
    }
  });
}
}
