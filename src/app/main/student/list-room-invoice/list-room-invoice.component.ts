import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { BaseComponent } from 'src/app/core/common/base-component';


@Component({
  selector: 'app-list-room-invoice',
  templateUrl: './list-room-invoice.component.html',
  styleUrls: ['./list-room-invoice.component.css']
})
export class ListRoomInvoiceComponent extends BaseComponent implements OnInit,AfterViewInit {

  list_roomInvoice: any;
  totalRoomInvoice: any;
  pageIndex: any=1;
  pageSize: any=5;

  frmSearch: FormGroup;


 statusMapping = {
   0: 'Đã thanh toán',
   1: 'Chưa thanh toán',
 };

 constructor(private authenticationService: AuthenticationService, injector: Injector) {
   super(injector);

   this.frmSearch = new FormGroup({
    'txt_low': new FormControl(''),
    'txt_high': new FormControl(''),
    'txt_month': new FormControl(''),
    'txt_year': new FormControl(''),
    'txt_type': new FormControl(''),
    'txt_filter': new FormControl(''),
    'txt_building': new FormControl('-1'),
    'txt_status': new FormControl('-1'),
  });
 }

 ngAfterViewInit() {
   this.loadScripts('assets/js/core/app.js', 'assets/js/pages/dashboard.js');
 }

 ngOnInit(): void {
   this.loadRoomInvoice();
 }

 public loadRoomInvoice(){
   this._api.get('/api/Invoice/getallpaging?'
   +'Id=' + this.authenticationService.userValue.userId
   +'&pageindex=' + this.pageIndex
   +'&pagesize=' + this.pageSize
   +'&Low=' + this.frmSearch.value['txt_low']
   +'&High=' + this.frmSearch.value['txt_high']
   +'&Month=' + this.frmSearch.value['txt_month']
   +'&Year=' + this.frmSearch.value['txt_year']
   +'&Type=' + this.frmSearch.value['txt_type']
   +'&Filter=' + this.frmSearch.value['txt_filter']
   +'&CampusId=' + -1
   +'&BuildingId=' + -1
   +'&Status=' + this.frmSearch.value['txt_status']
   ).subscribe(res => {
    this.list_roomInvoice = res.items;
    this.totalRoomInvoice=res.totalItem;
    console.log(this.list_roomInvoice)
    console.log(this.totalRoomInvoice)

   });
 }

 public loadPageIndex(pageIndex: any) {
  this.pageIndex=pageIndex;
  this.loadRoomInvoice();
}

public loadPageSize(pageSize:any) {
  this.pageIndex=1;
  this.pageSize=pageSize;
  this.loadRoomInvoice();
}

}
