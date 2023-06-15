import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
declare var $: any;

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent extends BaseComponent implements OnInit,AfterViewInit {

  //list
  list_building:any;
  list_campus:any;

  list_room: any;
  totalRoom: any;
  pageIndex: any = 1;
  pageSize: any = 5;
  frmSearch: FormGroup

  room: any;
  isCreate = false;
  showUpdateModal: any;
  frmRoom: FormGroup;
  doneSetupForm: any;
  title: any;

  statusMapping = {
    0: 'Phòng đã đầy',
    1: 'Phòng còn trống',
  };

  constructor(injector: Injector) {
    super(injector);
    this.frmSearch = new FormGroup({
      'txt_low': new FormControl(''),
      'txt_high': new FormControl(''),
      'txt_status': new FormControl('-1'),
      'txt_campus': new FormControl('-1'),
      'txt_building': new FormControl('-1'),
    });
  }

  ngAfterViewInit() {
    this.loadScripts('assets/js/core/app.js', 'assets/js/pages/dashboard.js');
  }

  ngOnInit(): void {
    this.loadRoom();
    this.loadBuilding();
    this.loadCampus();
  }

  public loadCampus(){
    this._api.get('/api/Campus/get').subscribe(res => {
      this.list_campus = res;
      console.log(this.list_campus)
    });

  }

  public loadBuilding(){
    this._api.get('/api/Building/get').subscribe(res => {
      this.list_building = res;
      console.log(this.list_building)
    });

  }

  public loadRoom(){
    this._api.get('/api/Room/getallpaging?'
    +'pageindex=' + this.pageIndex
    +'&pagesize=' + this.pageSize
    +'&Low=' + this.frmSearch.value['txt_low']
    +'&High=' + this.frmSearch.value['txt_high']
    +'&Status=' + this.frmSearch.value['txt_status']
    +'&CampusId=' + this.frmSearch.value['txt_campus']
    +'&BuildingId=' + this.frmSearch.value['txt_building']
    ).subscribe(res => {
      this.list_room = res.items;
      this.totalRoom=res.totalItem;

    });
  }

  public loadPageIndex(pageIndex: any) {
    this.pageIndex=pageIndex;
    this.loadRoom();
  }

  public loadPageSize(pageSize:any) {
    this.pageIndex=1;
    this.pageSize=pageSize;
    this.loadRoom();
  }

  get building() {
    return this.frmRoom.get('txt_building')!;
  }
  get name() {
    return this.frmRoom.get('txt_name')!;
  }
  get bed() {
    return this.frmRoom.get('txt_bed')!;
  }
  get Price() {
    return this.frmRoom.get('txt_Price')!;
  }
  get status() {
    return this.frmRoom.get('txt_status')!;
  }

  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    this.title="Thêm thông tin"
    setTimeout(() => {
      $('#createModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmRoom = new FormGroup({
        'txt_building': new FormControl('', [Validators.required]),
        'txt_name': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
        'txt_bed': new FormControl('', [Validators.min(1)]),
        'txt_type': new FormControl('', []),
        'txt_Price': new FormControl('', [Validators.min(1)]),
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
      this._api.get('/api/Room/getbyid/' + id).subscribe(res => {
        debugger;
        this.room = res;
        this.doneSetupForm = true;
        this.frmRoom = new FormGroup({
          'txt_building': new FormControl(this.room.buildingId, [Validators.required]),
          'txt_name': new FormControl(this.room.name, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
          'txt_type': new FormControl(this.room.type, []),
          'txt_bed': new FormControl(this.room.bed, [Validators.min(1)]),
          'txt_Price': new FormControl(this.room.price, [Validators.min(1)]),
        });
      });
    });
  }

  public onRemove(id: any) {
    this._api.delete('/api/Room/delete', id).subscribe(res => {
      alert('Xóa dữ liệu thành công');
      this.loadRoom();
    });
  }

  public closeModal() {
    $('#createModal').closest('.modal').modal('hide');
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.frmRoom.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  OnSubmit(vl: any) {
    console.log(this.findInvalidControls())
    if (this.frmRoom.invalid) {
      return;
    }
    let room: any;
    room = {
      BuildingId: vl.txt_building,
      Name: vl.txt_name,
      Type: vl.txt_type,
      Bed: Number(vl.txt_bed),
      Price: vl.txt_Price,
    }
    if (this.isCreate) {
      this._api.post('/api/Room/create', room).subscribe(res => {
        if (res && res.data) {
          alert('Thêm dữ liệu thành công');
          this.loadRoom();
          this.closeModal();
        } else {
          alert('Có lỗi')
        }
        });
    } else {
      room.id = this.room.id;
      this._api.put('/api/Room/update', room).subscribe(res => {
        if (res && res.data) {
          alert('Cập nhật dữ liệu thành công');
          this.loadRoom();
          this.closeModal();
        } else {
          alert('Có lỗi')
        }
      });
    }

  }

}
