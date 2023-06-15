import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
declare var $: any;

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.css']
})
export class CampusComponent extends BaseComponent implements OnInit,AfterViewInit {

  list_campus: any;
  totalCampus: any;
  pageIndex: any = 1;
  pageSize: any = 5;
  frmSearch: FormGroup

  campus: any;
  isCreate = false;
  showUpdateModal: any;
  frmCampus: FormGroup;
  doneSetupForm: any;
  title: any;

  constructor(injector: Injector) {
    super(injector);
    this.frmSearch = new FormGroup({
      'txt_name': new FormControl(''),
    });
  }

  ngAfterViewInit() {
    this.loadScripts('assets/js/core/app.js', 'assets/js/pages/dashboard.js');
  }

  ngOnInit(): void {
    this.loadCampus();
  }

  public loadCampus(){
    this._api.get('/api/Campus/getallpaging?'
    +'pageindex=' + this.pageIndex
    +'&pagesize=' + this.pageSize
    +'&Name=' + this.frmSearch.value['txt_name']
    ).subscribe(res => {
      this.list_campus = res.items;
      this.totalCampus=res.totalItem;
    });
  }

  public loadPageIndex(pageIndex: any) {
    this.pageIndex=pageIndex;
    this.loadCampus();
  }

  public loadPageSize(pageSize:any) {
    this.pageIndex=1;
    this.pageSize=pageSize;
    this.loadCampus();
  }

  get name() {
    return this.frmCampus.get('txt_name')!;
  }
  get email() {
    return this.frmCampus.get('txt_email')!;
  }
  get phone() {
    return this.frmCampus.get('txt_phone')!;
  }

  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    this.title="Thêm thông tin"
    setTimeout(() => {
      $('#createModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmCampus = new FormGroup({
        'txt_name': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
        'txt_address': new FormControl('', []),
        'txt_email': new FormControl('', [Validators.email]),
        'txt_phone': new FormControl('', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      });
    });
  }

  public openUpdateModal(id: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    this.title="Sửa thông tin"
    setTimeout(() => {
      $('#createModal').modal('toggle');
      this._api.get('/api/Campus/getbyid/' + id).subscribe(res => {
        debugger;
        this.campus = res;
        this.doneSetupForm = true;
        this.frmCampus = new FormGroup({
          'txt_name': new FormControl(this.campus.name, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
          'txt_address': new FormControl(this.campus.address),
          'txt_email': new FormControl(this.campus.email, [Validators.email]),
          'txt_phone': new FormControl(this.campus.phone, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
        });
      });
    });
  }

  public onRemove(id: any) {
    this._api.delete('/api/Campus/delete', id).subscribe(res => {
      alert('Xóa dữ liệu thành công');
      this.loadCampus();
    });
  }

  public closeModal() {
    $('#createModal').closest('.modal').modal('hide');
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.frmCampus.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  OnSubmit(vl: any) {
    console.log(this.findInvalidControls())
    if (this.frmCampus.invalid) {
      return;
    }
    let campus: any;
    campus = {
      Name: vl.txt_name,
      Address: vl.txt_address,
      Email: vl.txt_email,
      Phone: vl.txt_phone,
    }
    if (this.isCreate) {
      this._api.post('/api/Campus/create', campus).subscribe(res => {
        if (res && res.data) {
          alert('Thêm dữ liệu thành công');
          this.loadCampus();
          this.closeModal();
        } else {
          alert('Có lỗi')
        }
        });
    } else {
      campus.id = this.campus.id;
      this._api.put('/api/Campus/update', campus).subscribe(res => {
        if (res && res.data) {
          alert('Cập nhật dữ liệu thành công');
          this.loadCampus();
          this.closeModal();
        } else {
          alert('Có lỗi')
        }
      });
    }

  }

}
