import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../core/common/base-component';
import MatchValidation from '../core/helpers/must-match.validator';
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends BaseComponent implements OnInit, AfterViewInit {

  user: any;
  file: any;
  frmUser: FormGroup;
  doneSetupForm: any;
  avatarPreview: any;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.frmUser = new FormGroup({
      'txt_userName': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
      'txt_passWord': new FormControl('', [this.pwdCheckValidator]),
      'txt_rewrite_Password': new FormControl('', [Validators.required]),
      'txt_building': new FormControl(null, []),
      'txt_name': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
      'txt_dateOfBirth': new FormControl('',[]),
      'txt_gender': new FormControl('', []),
      'txt_address': new FormControl('', []),
      'txt_email': new FormControl('', [Validators.email]),
      'txt_phone': new FormControl('', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      'txt_citizenIdentityCard': new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]),
    }, {
      validators: [MatchValidation.match('txt_passWord', 'txt_rewrite_Password')]
    });
    this.avatarPreview="";
  }

  ngAfterViewInit() {
    this.loadScripts('assets/js/core/app.js','assets/js/pages/dashboard.js');
  }


  get userName() {
    return this.frmUser.get('txt_userName')!;
  }
  get passWord() {
    return this.frmUser.get('txt_passWord')!;
  }
  get rewrite_Password() {
    return this.frmUser.get('txt_rewrite_Password')!;
  }
  get status() {
    return this.frmUser.get('txt_status')!;
  }
  get role() {
    return this.frmUser.get('txt_role')!;
  }
  get name() {
    return this.frmUser.get('txt_name')!;
  }
  get email() {
    return this.frmUser.get('txt_email')!;
  }
  get phone() {
    return this.frmUser.get('txt_phone')!;
  }
  get citizenIdentityCard() {
    return this.frmUser.get('txt_citizenIdentityCard')!;
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


  OnSubmit(vl: any) {
    debugger;
    console.log(this.findInvalidControls())
    if (this.frmUser.invalid) {
      return;
    }
    let obj: any = {};
    obj.account = {
      UserName: vl.txt_userName,
      PassWord: vl.txt_passWord,
      Status: 1,
      Role: 2,
    }
    obj.user = {
      BuildingId: vl.txt_building,
      Name: vl.txt_name,
      DateOfBirth: vl.txt_dateOfBirth,
      Gender: vl.txt_gender,
      Address: vl.txt_address,
      Email: vl.txt_email,
      Phone: vl.txt_phone,
      CitizenIdentityCard: vl.txt_citizenIdentityCard
    }

    if (this.file) {
      this._api.uploadFileSingle('/api/upload/upload-single', 'user', this.file).subscribe((res: any) => {
        if (res && res.body && res.body.filePath) {
          obj.user.Avatar = res.body.filePath;
          this._api.post('/api/User/Register', obj).subscribe(res => {
            if (res == 1) {
              alert('Kiểm tra email của bạn');
            }
            else if (res == 2) {
              alert('Email này đã đăng ký tài khoản rồi');
            }
            else if (res == 3) {
              alert('Bạn đã có tài khoản nhưng chưa xác thực vui long kiểm tra email');
            }
            else {
              alert('Có lỗi')
            }
          });
        }
      });
    } else {
      this._api.post('/api/User/Register', obj).subscribe(res => {
        if (res && res.data) {
          alert('Kiểm tra email của bạn');
        }
        else if (res == 2) {
          alert('Email này đã đăng ký tài khoản rồi');
        }
        else {
          alert('Có lỗi')
        }
      });
    }
  }
}
