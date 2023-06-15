import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
declare var $: any;

@Component({
  selector: 'app-electricity-water-rate',
  templateUrl: './electricity-water-rate.component.html',
  styleUrls: ['./electricity-water-rate.component.css']
})
export class ElectricityWaterRateComponent extends BaseComponent implements OnInit,AfterViewInit {

  list_electricityWaterRate: any;
  totalElectricityWaterRate: any;
  pageIndex: any = 1;
  pageSize: any = 5;

  electricityWaterRate: any;
  isCreate = false;
  showUpdateModal: any;
  frmElectricityWaterRate: FormGroup;
  doneSetupForm: any;
  title: any;

  constructor(injector: Injector) {
    super(injector);
  }

  ngAfterViewInit() {
    this.loadScripts('assets/js/core/app.js', 'assets/js/pages/dashboard.js');
  }

  ngOnInit(): void {
    this.loadElectricityWaterRate();
  }

  public loadElectricityWaterRate(){
    this._api.get('/api/ElectricityWaterRate/getallpaging?'
    +'pageindex=' + this.pageIndex
    +'&pagesize=' + this.pageSize
    ).subscribe(res => {
      this.list_electricityWaterRate = res.items;
      this.totalElectricityWaterRate=res.totalItem;
    });
  }

  public loadPageIndex(pageIndex: any) {
    this.pageIndex=pageIndex;
    this.loadElectricityWaterRate();
  }

  public loadPageSize(pageSize:any) {
    this.pageIndex=1;
    this.pageSize=pageSize;
    this.loadElectricityWaterRate();
  }

  get type() {
    return this.frmElectricityWaterRate.get('txt_type')!;
  }
  get tier() {
    return this.frmElectricityWaterRate.get('txt_tier')!;
  }
  get startAmount() {
    return this.frmElectricityWaterRate.get('txt_startAmount')!;
  }
  get endAmount() {
    return this.frmElectricityWaterRate.get('txt_endAmount')!;
  }
  get unit() {
    return this.frmElectricityWaterRate.get('txt_unit')!;
  }
  get price() {
    return this.frmElectricityWaterRate.get('txt_price')!;
  }

  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    this.title="Thêm thông tin"
    setTimeout(() => {
      $('#createModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmElectricityWaterRate = new FormGroup({
        'txt_type': new FormControl('', [Validators.required]),
        'txt_tier': new FormControl('', [Validators.min(1)]),
        'txt_startAmount': new FormControl('', [Validators.min(1)]),
        'txt_endAmount': new FormControl('', [Validators.min(1)]),
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
      this._api.get('/api/ElectricityWaterRate/getbyid/' + id).subscribe(res => {
        debugger;
        this.electricityWaterRate = res;
        this.doneSetupForm = true;
        this.frmElectricityWaterRate = new FormGroup({
          'txt_type': new FormControl(this.electricityWaterRate.type, [Validators.required]),
          'txt_tier': new FormControl(this.electricityWaterRate.tier, [Validators.min(1)]),
          'txt_startAmount': new FormControl(this.electricityWaterRate.startAmount, [Validators.min(0)]),
          'txt_endAmount': new FormControl(this.electricityWaterRate.endAmount, [Validators.min(1)]),
          'txt_unit': new FormControl(this.electricityWaterRate.unit, [Validators.required]),
          'txt_price': new FormControl(this.electricityWaterRate.price, [Validators.min(1)]),
        });
      });
    });
  }

  public onRemove(id: any) {
    this._api.delete('/api/ElectricityWaterRate/delete', id).subscribe(res => {
      alert('Xóa dữ liệu thành công');
      this.loadElectricityWaterRate();
    });
  }

  public closeModal() {
    $('#createModal').closest('.modal').modal('hide');
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.frmElectricityWaterRate.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  OnSubmit(vl: any) {
    console.log(this.findInvalidControls())
    if (this.frmElectricityWaterRate.invalid) {
      return;
    }
    let electricityWaterRate: any;
    electricityWaterRate = {
      Type: vl.txt_type,
      tier: Number(vl.txt_tier),
      startAmount: Number(vl.txt_startAmount),
      endAmount: Number(vl.txt_endAmount),
      Unit: vl.txt_unit,
      Price: Number(vl.txt_price),
    }
    if (this.isCreate) {
      this._api.post('/api/ElectricityWaterRate/create', electricityWaterRate).subscribe(res => {
        if (res && res.data) {
          alert('Thêm dữ liệu thành công');
          this.loadElectricityWaterRate();
          this.closeModal();
        } else {
          alert('Có lỗi')
        }
        });
    } else {
      electricityWaterRate.id = this.electricityWaterRate.id;
      this._api.put('/api/ElectricityWaterRate/update', electricityWaterRate).subscribe(res => {
        if (res && res.data) {
          alert('Cập nhật dữ liệu thành công');
          this.loadElectricityWaterRate();
          this.closeModal();
        } else {
          alert('Có lỗi')
        }
      });
    }

  }

}
