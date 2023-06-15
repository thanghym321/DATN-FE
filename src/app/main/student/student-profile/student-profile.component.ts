import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { BaseComponent } from 'src/app/core/common/base-component';
import MatchValidation from 'src/app/core/helpers/must-match.validator';
import { timer } from 'rxjs';
declare var $: any;


@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent extends BaseComponent implements OnInit,AfterViewInit{

  isButtonDisabled: boolean = false;

  user:any;
  frmUser: FormGroup;
  file: any;
  avatarPreview: any;
  showModal: any;
  doneSetupForm: any;
  frmPassword: FormGroup;

 constructor(private authenticationService: AuthenticationService, injector: Injector) {
   super(injector);
 }

 ngAfterViewInit() {
   this.loadScripts('assets/js/core/app.js', 'assets/js/pages/dashboard.js');
 }

 ngOnInit(): void {
   this.loadUser();
 }

get passWord() {
  return this.frmPassword.get('txt_passWord')!;
}
get rewrite_Password() {
  return this.frmPassword.get('txt_rewrite_Password')!;
}


get name() {
  return this.frmUser.get('txt_name')!;
}
get phone() {
  return this.frmUser.get('txt_phone')!;
}


 public loadUser(){
  this._api.get('/api/User/getbyid/' + this.authenticationService.userValue.userId).subscribe(res => {
    this.user = res;
    console.log(this.user);
    this.frmUser = new FormGroup({
      'txt_name': new FormControl(this.user.name, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
      'txt_dateOfBirth': new FormControl(this.user.dateOfBirth),
      'txt_gender': new FormControl(this.user.gender, []),
      'txt_address': new FormControl(this.user.address, []),
      'txt_phone': new FormControl(this.user.phone, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    }, {
    });
    this.frmUser.get('txt_dateOfBirth')?.patchValue(this.formatDate(new Date(this.user.dateOfBirth)));
    this.avatarPreview=this.user.avatar;
  });
 }

 Logout() {
  this.authenticationService.logout();
}

public Modal() {
  this.showModal = true;
  setTimeout(() => {
    $('#Modal').modal('toggle');
    this.doneSetupForm = true;
    this.frmPassword = new FormGroup({
      'txt_passWord': new FormControl('', [this.pwdCheckValidator]),
      'txt_rewrite_Password': new FormControl('', [Validators.required]),
      'txt_code': new FormControl(''),
    }, {
      validators: [MatchValidation.match('txt_passWord', 'txt_rewrite_Password')]
    });
  });
}

public closeModal() {
  $('#createModal').closest('.modal').modal('hide');
}

public pwdCheckValidator(control: any) {
  var filteredStrings = { search: control.value, select: '@#!$%&*' }
  var result = (filteredStrings.select.match(new RegExp('[' + filteredStrings.search + ']', 'g')) || []).join('');
  if (control.value.length < 6 || !result) {
    return { passWord: true };
  } else {
    return null;
  }
}

public upload(event: any) {
  if (event.target.files && event.target.files.length > 0) {
    this.file = event.target.files[0];
    this._api.uploadFileSingle('/api/upload/upload', 'user', this.file).subscribe((res: any) => {
      this.avatarPreview = res.body.filePath;
    });
  }
}
public findInvalidControls() {
  const invalid = [];
  const controls = this.frmUser.controls;
  for (const name in controls) {
    if (controls[name].invalid) {
      invalid.push(name);
    }
  }
  return invalid;
}

public disableButton() {
  this.isButtonDisabled = true; // Vô hiệu hóa button

  timer(30000).subscribe(() => {
    this.isButtonDisabled = false; // Kích hoạt lại button sau 30 giây
  });
}


OnSubmit(vl: any) {
  if (this.frmUser.invalid) {
    return;
  }
  let obj: any = {};
  obj.account = {
    UserName: this.user.userName,
    PassWord: this.user.passWord,
    Status: this.user.Status,
    Role: this.user.role,
  }
  obj.user = {
    Name: vl.txt_name,
    DateOfBirth: vl.txt_dateOfBirth,
    Gender: vl.txt_gender,
    Address: vl.txt_address,
    Email: this.user.email,
    Phone: vl.txt_phone,
    CitizenIdentityCard: this.user.citizenIdentityCard
  }

  obj.user.Id = this.user.userId;
  obj.account.userId = this.user.userId;
  this._api.uploadFileSingle('/api/upload/upload-single', 'user', this.file).subscribe((res: any) => {
    if (res && res.body && res.body.filePath) {
      obj.user.Avatar = res.body.filePath;
      this._api.put('/api/User/update', obj).subscribe(res => {
        if (res && res.data) {
          alert('Cập nhật dữ liệu thành công');
          this.loadUser();
          this.closeModal();
        } else {
          alert('Có lỗi')
        }
      });
    }
  });
}

OnSubmit1() {
  this._api.get('/api/User/SendMailChangePassword/'
  +'?Email=' + this.authenticationService.userValue.email
  +'&Id=' + this.authenticationService.userValue.userId
  ).subscribe(res => {
    this.user = res;
    if (res==1) {
      alert("Gửi mã thành công");
    }
    else {
      alert("Có lỗi xảy ra");
    }
  });
}

OnSubmit2() {
  debugger;
  if (this.frmUser.invalid) {
    return;
  }
  this._api.get('/api/User/VerifyChangePassWord'
  +'?Code=' + this.frmPassword.value['txt_code']
  +'&NewPassword=' + this.frmPassword.value['txt_passWord']
  +'&Id=' + this.authenticationService.userValue.userId
  ).subscribe(res => {
    debugger;
    if (res==1) {
      alert("Đổi mật khẩu thành công");
      this.loadUser();
      this.closeModal();
    }
    if (res==2){
      alert("Đổi mật khẩu thất bại");

    }
  });
}

}
