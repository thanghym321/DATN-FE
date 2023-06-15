import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BaseComponent } from 'src/app/core/common/base-component';
declare var $: any;

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent extends BaseComponent implements OnInit,AfterViewInit {

  list_service: any;
  totalService: any;
  pageIndex: any = 1;
  pageSize: any = 5;

  service: any;
  isCreate = false;
  showUpdateModal: any;
  frmService: FormGroup;
  doneSetupForm: any;
  title: any;

  public Editor = ClassicEditor;

  constructor(injector: Injector) {
    super(injector);
  }

  ngAfterViewInit() {
    this.loadScripts('assets/js/core/app.js', 'assets/js/pages/dashboard.js');
  }

  ngOnInit(): void {
    this.loadService();
  }
  public loadService(){
    this._api.get('/api/Service/getallpaging?'
    +'pageindex=' + this.pageIndex
    +'&pagesize=' + this.pageSize
    ).subscribe(res => {
      this.list_service = res.items;
      this.totalService=res.totalItem;
    });
  }

  public loadPageIndex(pageIndex: any) {
    this.pageIndex=pageIndex;
    this.loadService();
  }

  public loadPageSize(pageSize:any) {
    this.pageIndex=1;
    this.pageSize=pageSize;
    this.loadService();
  }

  get name() {
    return this.frmService.get('txt_name')!;
  }
  get description() {
    return this.frmService.get('txt_description')!;
  }
  get unit() {
    return this.frmService.get('txt_unit')!;
  }
  get price() {
    return this.frmService.get('txt_price')!;
  }

  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    this.title="Thêm thông tin"
    setTimeout(() => {
      $('#createModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmService = new FormGroup({
        'txt_name': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
        'txt_description': new FormControl('', []),
        'txt_unit': new FormControl('', [Validators.required]),
        'txt_price': new FormControl('', [Validators.min(1)]),
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
      this._api.get('/api/Service/getbyid/' + id).subscribe(res => {
        this.service = res;
        this.doneSetupForm = true;
        this.frmService = new FormGroup({
          'txt_name': new FormControl(this.service.name, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
          'txt_description': new FormControl(this.service.description, []),
          'txt_unit': new FormControl(this.service.unit, [Validators.required]),
          'txt_price': new FormControl(this.service.price, [Validators.min(1)]),
        });
      });
    });
  }

  public onRemove(id: any) {
    this._api.delete('/api/Service/delete', id).subscribe(res => {
      alert('Xóa dữ liệu thành công');
      this.loadService();
    });
  }

  public closeModal() {
    $('#createModal').closest('.modal').modal('hide');
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.frmService.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  OnSubmit(vl: any) {
    console.log(this.findInvalidControls())
    if (this.frmService.invalid) {
      return;
    }
    let service: any;
    service = {
      Name: vl.txt_name,
      Description: vl.txt_description,
      Unit: vl.txt_unit,
      Price: Number(vl.txt_price),
    }
    if (this.isCreate) {
      this._api.post('/api/Service/create', service).subscribe(res => {
        if (res && res.data) {
          alert('Thêm dữ liệu thành công');
          this.loadService();
          this.closeModal();
        } else {
          alert('Có lỗi')
        }
        });
    } else {
      service.id = this.service.id;
      this._api.put('/api/Service/update', service).subscribe(res => {
        if (res && res.data) {
          alert('Cập nhật dữ liệu thành công');
          this.loadService();
          this.closeModal();
        } else {
          alert('Có lỗi')
        }
      });
    }

  }

}
