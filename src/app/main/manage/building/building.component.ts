import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
declare var $: any;

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})
export class BuildingComponent extends BaseComponent implements OnInit,AfterViewInit {
  //list
  list_campus:any;

  list_building: any;
  totalBuilding: any;
  pageIndex: any = 1;
  pageSize: any = 5;
  frmSearch: FormGroup

  building: any;
  isCreate = false;
  showUpdateModal: any;
  frmBuilding: FormGroup;
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
    this.loadBuilding();
    this.loadCampus();
  }

  public loadCampus(){
    this._api.get('/api/Campus/get').subscribe(res => {
      this.list_campus = res;
    });

  }

  public loadBuilding(){
    this._api.get('/api/Building/getallpaging?'
    +'pageindex=' + this.pageIndex
    +'&pagesize=' + this.pageSize
    +'&Name=' + this.frmSearch.value['txt_name']
    ).subscribe(res => {
      this.list_building = res.items;
      this.totalBuilding=res.totalItem;
    });
  }

  public loadPageIndex(pageIndex: any) {
    this.pageIndex=pageIndex;
    this.loadBuilding();
  }

  public loadPageSize(pageSize:any) {
    this.pageIndex=1;
    this.pageSize=pageSize;
    this.loadBuilding();
  }

  get campus() {
    return this.frmBuilding.get('txt_campus')!;
  }
  get name() {
    return this.frmBuilding.get('txt_name')!;
  }
  get floor() {
    return this.frmBuilding.get('txt_floor')!;
  }

  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    this.title="Thêm thông tin"
    setTimeout(() => {
      $('#createModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmBuilding = new FormGroup({
        'txt_campus': new FormControl('', [Validators.required]),
        'txt_name': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
        'txt_floor': new FormControl('', [Validators.min(1)]),
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
      this._api.get('/api/Building/getbyid/' + id).subscribe(res => {
        debugger;
        this.building = res;
        this.doneSetupForm = true;
        this.frmBuilding = new FormGroup({
          'txt_campus': new FormControl(this.building.campusId, [Validators.required]),
          'txt_name': new FormControl(this.building.name, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
          'txt_floor': new FormControl(this.building.floor, [Validators.min(1)]),
        });
      });
    });
  }

  public onRemove(id: any) {
    this._api.delete('/api/Building/delete', id).subscribe(res => {
      alert('Xóa dữ liệu thành công');
      this.loadBuilding();
    });
  }

  public closeModal() {
    $('#createModal').closest('.modal').modal('hide');
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.frmBuilding.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  OnSubmit(vl: any) {
    console.log(this.findInvalidControls())
    if (this.frmBuilding.invalid) {
      return;
    }
    let building: any;
    building = {
      CampusId: vl.txt_campus,
      Name: vl.txt_name,
      Floor: Number(vl.txt_floor),
    }
    if (this.isCreate) {
      this._api.post('/api/Building/create', building).subscribe(res => {
        if (res && res.data) {
          alert('Thêm dữ liệu thành công');
          this.loadBuilding();
          this.closeModal();
        } else {
          alert('Có lỗi')
        }
        });
    } else {
      building.id = this.building.id;
      this._api.put('/api/Building/update', building).subscribe(res => {
        if (res && res.data) {
          alert('Cập nhật dữ liệu thành công');
          this.loadBuilding();
          this.closeModal();
        } else {
          alert('Có lỗi')
        }
      });
    }

  }

}
