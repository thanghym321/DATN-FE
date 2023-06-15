import { AfterViewInit, Component, Injector, OnInit, Renderer2 } from '@angular/core';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { BaseComponent } from 'src/app/core/common/base-component';

@Component({
  selector: 'app-wait-room-invoice',
  templateUrl: './wait-room-invoice.component.html',
  styleUrls: ['./wait-room-invoice.component.css']
})
export class WaitRoomInvoiceComponent extends BaseComponent implements OnInit,AfterViewInit {

  list_roomInvoice: any;
  totalRoomInvoice: any;
  pageIndex: any=1;
  pageSize: any=5;
  roomInvoice: any;

 statusMapping = {
   0: 'Đã thanh toán',
   1: 'Chưa thanh toán',
 };

 constructor(private authenticationService: AuthenticationService, injector: Injector, private renderer: Renderer2) {
   super(injector);
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
   +'&CampusId=' + -1
   +'&BuildingId=' + -1
   +'&Status=' + 1
   ).subscribe(res => {
    this.list_roomInvoice = res.items;
    this.totalRoomInvoice =res.totalItem;
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

public Pay(Id:any) {
  debugger;
  this._api.get('/api/Invoice/getbyid/' + Id).subscribe(res => {
    this.roomInvoice = res;
  });
  let obj =  {
    OrderType: "billpayment",
    Amount: 200000,
    OrderDescription: "Tien Dien",
    Name: "Nguyen Tran Anh Thang"
  }
  this._api.post('/api/VnPay/CreatePaymentUrl/', obj).subscribe(res => {
    this.renderer.setAttribute(window.open(res, '_blank'), 'target', '_blank');
    console.log(res)
  });
}

}
