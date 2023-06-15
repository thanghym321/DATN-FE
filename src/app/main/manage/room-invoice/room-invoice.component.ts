import { CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { BaseComponent } from 'src/app/core/common/base-component';



@Component({
  selector: 'app-room-invoice',
  templateUrl: './room-invoice.component.html',
  styleUrls: ['./room-invoice.component.css']
})
export class RoomInvoiceComponent extends BaseComponent implements OnInit,AfterViewInit {

  invoicePreviewId: string = 'invoicePreview';

  list_campus:any;
  list_building:any;

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
    'txt_status': new FormControl('-1'),
    'txt_campus': new FormControl('-1'),
    'txt_building': new FormControl('-1'),
  });
 }

 ngAfterViewInit() {
   this.loadScripts('assets/js/core/app.js', 'assets/js/pages/dashboard.js');
 }

 ngOnInit(): void {
   this.loadRoomInvoice();
   this.loadBuilding();
   this.loadCampus();
 }

public loadBuilding(){
  this._api.get('/api/Building/get').subscribe(res => {
    this.list_building = res;
  });

}

public loadCampus(){
  this._api.get('/api/Campus/get').subscribe(res => {
    this.list_campus = res;
  });

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
   +'&Status=' + this.frmSearch.value['txt_status']
   +'&CampusId=' + this.frmSearch.value['txt_campus']
   +'&BuildingId=' + this.frmSearch.value['txt_building']
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

public printHtml(item:any) {
  let data = `
  <section style="text-align: center;">
      <h1>HÓA ĐƠN GIÁ TRỊ GIA TĂNG</h1>
      <div class="ban">(Bản thể hiện hóa đơn điện tử)</div>
      <div class="ngay">
          <p id="date"></p>
          <script>
              n = new Date();
              y = n.getFullYear();
              m = n.getMonth() + 1;
              d = n.getDate();
              document.getElementById("date").innerHTML = "Ngày " + d + " tháng " + m + " năm " + y;
          </script>
      </div>
  </section>

  <div class="le dam">Tên đơn vị bán hàng: Ký túc xá ĐHSPKTHY</div>
  <div class="le">Mã số thuế: 3269289058</div>
  <div class="le">Địa chỉ: Mỹ Hào, Hưng Yên</div>
  <div class="le doi">Điện thoại: 02213.689.555</div>
  <div class="le doi">Số tài khoản: 762618652671614</div>
  <div class="le dam">Người mua hàng: ${item.name}</div>
  <div class="le">Email: ${item.email}</div>
  <div class="le">Điện thoại: ${item.phone}</div>
  <div class="le">Địa chỉ: ${item.address}/div>
  <div class="le doi">Hình thức thanh toán: Tiền mặt / Chuyển khoản</div>
  <div class="le doi">Số tài khoản: 526716147626186</div>
  <div class="le">Ghi chú: </div>
  <table>
      <tr>
          <th>STT</th>
          <th>Tên sản phẩm</th>
          <th>Đơn giá</th>
          <th>Số lượng</th>
          <th>Thành tiền</th>
      </tr>
      <tr>
          <td></td>
          <td>Tiền ${item.type}</td>
          <td>${item.unitPrice}</td>
          <td>${item.quantity}</td>
          <td>${item.total}</td>
      </tr>
  </table>
  <div class="doi dam ky">Người mua hàng</div>
  <div class="doi dam ky">Người bán hàng</div>
  <div class="doi ky1">(Ký, ghi rõ họ tên)</div>
  <div class="doi ky1">(Ký, ghi rõ họ tên)</div>
  `;

  let popupWin: any = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  popupWin.document.write(`
    <html>
      <head>
        <title>Print tab</title>
        <style>
        .print table {
            margin-top: 15px;
            width: 100%;
        }
        print tr {
            line-height: 27px;
        }

        .print table,
        th,
        td {
            border: 1px solid black;
            border-collapse: collapse;
            text-align: center;
        }

        .print .ngay {
            font-style: italic;
            font-size: 15px;
            margin-bottom: 5px;
        }

        .print .ban {
            font-style: italic;
            font-size: 15px;
            margin: 3px 0px;
        }

        .print .dam {
            font-weight: bold;
        }

        .print .le {
            margin-bottom: 4px;
            font-size: 15px;
        }

        .print .doi {
            width: 50%;
            float: left;
        }

        .print .ky {
            text-align: center;
            margin-top: 20px;
        }

        .print .ky1 {
            font-style: italic;
            text-align: center;
            margin-top: 5px;
        }
    </style>
      </head>
    <body class='print' onload="window.print();window.close()">${data}</body>
    </html>`
  );
  popupWin.document.close();
}


}
