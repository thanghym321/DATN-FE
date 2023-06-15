import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/common/base-component';
import MatchValidation from '../../../core/helpers/must-match.validator';
declare var $: any;

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent extends BaseComponent implements OnInit, AfterViewInit {
  //list
  list_building:any;

  list_user: any;
  totalUser: any;
  pageIndex: any=1;
  pageSize: any=5;
  frmSearch: FormGroup;

  user: any;
  isCreate = false;
  file: any;
  showUpdateModal: any;
  frmUser: FormGroup;
  doneSetupForm: any;
  avatarPreview: any;
  title: any;

  statusMapping = {
    0: 'Kích hoạt',
    1: 'Không kích hoạt',
  };

  roleMapping = {
    0: 'Admin',
    1: 'Manage',
    2: 'Student'
  };

  constructor(injector: Injector) {
    super(injector);
    this.frmSearch = new FormGroup({
      'txt_userName': new FormControl(''),
      'txt_name': new FormControl(''),
      'txt_role': new FormControl('-1'),
    });
  }

  ngOnInit(): void {
    this.LoadData();
    this.loadCampus();
  }

  ngAfterViewInit() {
    this.loadScripts('assets/js/core/app.js','assets/js/pages/dashboard.js');
  }

  public loadCampus(){
    this._api.get('/api/Building/get').subscribe(res => {
      this.list_building = res;
      console.log(this.list_building)
    });

  }
  public LoadData() {
    this._api.get('/api/User/getallpaging?'
    +'pageindex=' + this.pageIndex
    +'&pagesize=' + this.pageSize
    +'&UserName=' + this.frmSearch.value['txt_userName']
    +'&Name=' + this.frmSearch.value['txt_name']
    +'&Role=' + this.frmSearch.value['txt_role']
    ).subscribe(res => {
      this.list_user = res.items;
      this.totalUser=res.totalItem;
    });
  }

  public loadPageIndex(pageIndex: any) {
    this.pageIndex=pageIndex;
    this.LoadData();
  }

  public loadPageSize(pageSize:any) {
    this.pageIndex=1;
    this.pageSize=pageSize;
    this.LoadData();
  }

  public updateStatus(status:any){

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

  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    this.title="Thêm thông tin"
    setTimeout(() => {
      $('#createModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmUser = new FormGroup({
        'txt_userName': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
        'txt_passWord': new FormControl('', [this.pwdCheckValidator]),
        'txt_rewrite_Password': new FormControl('', [Validators.required]),
        'txt_status': new FormControl('', [Validators.required]),
        'txt_role': new FormControl('', [Validators.required]),
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
    });
  }


  public openUpdateModal(Id: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    this.title="Sửa thông tin"
    setTimeout(() => {
      $('#createModal').modal('toggle');
      this._api.get('/api/User/getbyid/' + Id).subscribe(res => {
        this.user = res;
        console.log(this.user);
        this.doneSetupForm = true;
        this.frmUser = new FormGroup({

          'txt_userName': new FormControl(this.user.userName, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
          'txt_passWord': new FormControl(this.user.passWord, [this.pwdCheckValidator]),
          'txt_rewrite_Password': new FormControl(this.user.passWord, [Validators.required]),
          'txt_status': new FormControl(this.user.status, [Validators.required]),
          'txt_role': new FormControl(this.user.role, [Validators.required]),
          'txt_building': new FormControl(this.user.Campus, []),
          'txt_name': new FormControl(this.user.name, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
          'txt_dateOfBirth': new FormControl(this.user.dateOfBirth),
          'txt_gender': new FormControl(this.user.gender, []),
          'txt_address': new FormControl(this.user.address, []),
          'txt_email': new FormControl(this.user.email, [Validators.email]),
          'txt_phone': new FormControl(this.user.phone, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
          'txt_citizenIdentityCard': new FormControl(this.user.citizenIdentityCard, [Validators.required, Validators.minLength(12), Validators.maxLength(12)]),
        }, {
          validators: [MatchValidation.match('txt_passWord', 'txt_rewrite_Password')]
        });
        this.frmUser.get('txt_dateOfBirth')?.patchValue(this.formatDate(new Date(this.user.dateOfBirth)));
        console.log(this.user.dateOfBirth)
      });
      this.avatarPreview=this.user.image;
    });
  }

  public onRemove(userId: any) {
    this._api.delete('/api/User/delete', userId).subscribe(res => {
      alert('Xóa dữ liệu thành công');
      this.LoadData();
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
    debugger;
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
      Status: Number(vl.txt_status),
      Role: Number(vl.txt_role),
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

    if (this.isCreate) {
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'user', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            obj.user.Avatar = res.body.filePath;
            this._api.post('/api/User/create', obj).subscribe(res => {
              if (res && res.data) {
                alert('Thêm dữ liệu thành công');
                this.LoadData();
                this.closeModal();
              } else {
                alert('Có lỗi')
              }
            });
          }
        });
      } else {
        this._api.post('/api/User/create', obj).subscribe(res => {
          if (res && res.data) {
            alert('Thêm dữ liệu thành công');
            this.LoadData();
            this.closeModal();
          } else {
            alert('Có lỗi')
          }
        });
      }
    } else {
      obj.user.Id = this.user.userId;
      obj.account.userId = this.user.userId;
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'user', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            obj.user.Avatar = res.body.filePath;
            this._api.put('/api/User/update', obj).subscribe(res => {
              if (res && res.data) {
                alert('Cập nhật dữ liệu thành công');
                this.LoadData();
                this.closeModal();
              } else {
                alert('Có lỗi')
              }
            });
          }
        });
      } else {
        this._api.put('/api/User/update', obj).subscribe(res => {
          if (res && res.data) {
            alert('Cập nhật dữ liệu thành công');
            this.LoadData();
            this.closeModal();
          } else {
            alert('Có lỗi')
          }
        });
      }
    }

  }
}
