import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { BaseComponent } from 'src/app/core/common/base-component';

@Component({
  selector: 'app-wait-room-registration',
  templateUrl: './wait-room-registration.component.html',
  styleUrls: ['./wait-room-registration.component.css']
})
export class WaitRoomRegistrationComponent extends BaseComponent implements OnInit,AfterViewInit {

  list_roomRegistration: any;
  totalRoomRegistration: any;
  pageIndex: any = 1;
  pageSize: any = 5;

  statusMapping = {
    0: 'Đẫ duyệt',
    1: 'Đang chờ duyệt',
    2: 'Đã rời phòng'
  };

  constructor(private authenticationService: AuthenticationService, injector: Injector) {
    super(injector);
  }

  ngAfterViewInit() {
    this.loadScripts('assets/js/core/app.js', 'assets/js/pages/dashboard.js');
  }

  ngOnInit(): void {
    this.loadRoomRegistration();
  }


  public loadRoomRegistration(){
    this._api.get('/api/RoomRegistration/getallpaging?'
    +'Id=' + this.authenticationService.userValue.userId
    +'&pageindex=' + this.pageIndex
    +'&pagesize=' + this.pageSize
    +'&CampusId=' + -1
    +'&BuildingId=' + -1
    +'&Status=' + 1
    ).subscribe(res => {
      this.list_roomRegistration = res.items;
      this.totalRoomRegistration=res.totalItem;
    });
  }

  public loadPageIndex(pageIndex: any) {
    this.pageIndex=pageIndex;
    this.loadRoomRegistration();
  }

  public loadPageSize(pageSize:any) {
    this.pageIndex=1;
    this.pageSize=pageSize;
    this.loadRoomRegistration();
  }

  public confirm(Id:any){
    this._api.put('/api/RoomRegistration/confirm/',Id).subscribe(res => {
      if (res && res.data) {
        alert("Xác nhận thành công");
      } else {
        alert('Có lỗi')
      }
    });
    this.loadRoomRegistration();
  }

}
