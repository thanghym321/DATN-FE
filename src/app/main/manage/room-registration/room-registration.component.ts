import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { BaseComponent } from 'src/app/core/common/base-component';

@Component({
  selector: 'app-room-registration',
  templateUrl: './room-registration.component.html',
  styleUrls: ['./room-registration.component.css']
})
export class RoomRegistrationComponent extends BaseComponent implements OnInit,AfterViewInit {

  list_campus:any;
  list_building:any;

  list_roomRegistration: any;
  totalRoomRegistration: any;
  pageIndex: any = 1;
  pageSize: any = 5;
  frmSearch:FormGroup

  statusMapping = {
    0: 'Đã duyệt',
    1: 'Đang chờ duyệt',
    2: 'Đã rời phòng'
  };

  constructor(private authenticationService: AuthenticationService, injector: Injector) {
    super(injector);

    this.frmSearch = new FormGroup({
      'txt_name': new FormControl(''),
      'txt_month': new FormControl(''),
      'txt_year': new FormControl(''),
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
    this.loadRoomRegistration();
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


  public loadRoomRegistration(){
    this._api.get('/api/RoomRegistration/getallpaging?'
    +'Id=' + this.authenticationService.userValue.userId
    +'&pageindex=' + this.pageIndex
    +'&pagesize=' + this.pageSize
    +'&Name=' + this.frmSearch.value['txt_name']
    +'&Month=' + this.frmSearch.value['txt_month']
    +'&Year=' + this.frmSearch.value['txt_year']
    +'&Filter=' + this.frmSearch.value['txt_filter']
    +'&Status=' + this.frmSearch.value['txt_status']
    +'&CampusId=' + this.frmSearch.value['txt_campus']
    +'&BuildingId=' + this.frmSearch.value['txt_building']
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
