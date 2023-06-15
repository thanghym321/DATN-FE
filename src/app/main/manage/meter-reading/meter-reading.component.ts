import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BaseComponent } from 'src/app/core/common/base-component';
import { DialogComponent } from 'src/app/shared/components/Dialog/Dialog.component';
declare var $: any;

@Component({
  selector: 'app-meter-reading',
  templateUrl: './meter-reading.component.html',
  styleUrls: ['./meter-reading.component.css']
})
export class MeterReadingComponent extends BaseComponent implements OnInit,AfterViewInit {
  //list
  list_room:any;
  findRoom:any="";

  list_meterReading: any;
  totalMeterReading: any;
  pageIndex: any = 1;
  pageSize: any = 5;

  meterReading: any;
  isCreate = false;
  showUpdateModal: any;
  frmMeterReading: FormGroup;
  doneSetupForm: any;
  title: any;

  constructor(injector: Injector, private dialog: MatDialog) {
    super(injector);
  }

  ngAfterViewInit() {
    this.loadScripts('assets/js/core/app.js', 'assets/js/pages/dashboard.js');
  }

  ngOnInit(): void {
    this.loadMeterReading();
    this.loadRoom();
  }

  public loadRoom(){
    this._api.get('/api/Room/get?Name=' + this.findRoom).subscribe(res => {
      this.list_room = res;
      console.log(this.list_room);
    });

  }

  public loadMeterReading(){
    this._api.get('/api/MeterReading/getallpaging?'
    +'pageindex=' + this.pageIndex
    +'&pagesize=' + this.pageSize
    ).subscribe(res => {
      this.list_meterReading = res.items;
      this.totalMeterReading=res.totalItem;
    });
  }

  public loadPageIndex(pageIndex: any) {
    this.pageIndex=pageIndex;
    this.loadMeterReading();
  }

  public loadPageSize(pageSize:any) {
    this.pageIndex=1;
    this.pageSize=pageSize;
    this.loadMeterReading();
  }

  get room() {
    return this.frmMeterReading.get('txt_room')!;
  }
  get electricityIndex() {
    return this.frmMeterReading.get('txt_electricityIndex')!;
  }
  get waterIndex() {
    return this.frmMeterReading.get('txt_waterIndex')!;
  }

  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    this.title="Thêm thông tin"
    setTimeout(() => {
      $('#createModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmMeterReading = new FormGroup({
        'txt_room': new FormControl('', [Validators.required]),
        'txt_electricityIndex': new FormControl('', [Validators.min(1)]),
        'txt_waterIndex': new FormControl('', [Validators.min(1)]),
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
      this._api.get('/api/MeterReading/getbyid/' + id).subscribe(res => {
        this.meterReading = res;
        this.doneSetupForm = true;
        this.frmMeterReading = new FormGroup({
          'txt_room': new FormControl(this.meterReading.roomId, [Validators.required]),
          'txt_electricityIndex': new FormControl(this.meterReading.electricityIndex, [Validators.min(1)]),
          'txt_waterIndex': new FormControl(this.meterReading.waterIndex, [Validators.min(1)]),
        });
      });
    });
  }

  public onRemove(id: any) {
    this._api.delete('/api/MeterReading/delete', id).subscribe(res => {
      alert('Xóa dữ liệu thành công');
      this.loadMeterReading();
    });
  }

  public closeModal() {
    $('#createModal').closest('.modal').modal('hide');
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.frmMeterReading.controls;
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
    if (this.frmMeterReading.invalid) {
      return;
    }
    let meterReading: any;
    meterReading = {
      RoomId: Number(vl.txt_room),
      ElectricityIndex: Number(vl.txt_electricityIndex),
      WaterIndex: Number(vl.txt_waterIndex),
    }
    if (this.isCreate) {
      this._api.post('/api/MeterReading/create', meterReading).subscribe(res => {
        if (res==1) {
          this.openDialog("Đăng ký thành công", true);
          this.loadMeterReading();
          this.closeModal();
        }
        else if (res==2)
        {
          this.openDialog("Đã có chỉ số điện tháng này rồi", false);
          this.loadMeterReading();
          this.closeModal();
        }
        else {
          this.openDialog("Có lỗi xảy ra", false);
        }
        });
    } else {
      meterReading.id = this.meterReading.id;
      this._api.put('/api/MeterReading/update', meterReading).subscribe(res => {
        if (res && res.data) {
          alert('Cập nhật dữ liệu thành công');
          this.loadMeterReading();
          this.closeModal();
        } else {
          alert('Có lỗi')
        }
      });
    }

  }

  public openDialog(message: string, isSuccess: boolean): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '250px';
    dialogConfig.position = { top: '20px', right: '20px' };
    dialogConfig.backdropClass= 'false';
    dialogConfig.data = { message: message, isSuccess: isSuccess };
    this.dialog.open(DialogComponent, dialogConfig);
    setTimeout(() => {
      this.dialog.closeAll();
    }, 2000);
  }

}
