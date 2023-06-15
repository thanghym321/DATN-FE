import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { BaseComponent } from 'src/app/core/common/base-component';
import { DialogComponent } from 'src/app/shared/components/Dialog/Dialog.component';

@Component({
  selector: 'app-room',
  templateUrl: './search-room.component.html',
  styleUrls: ['./search-room.component.css']
})
export class SearchRoomComponent extends BaseComponent implements OnInit,AfterViewInit {

  list_room: any;
  totalRoom: any;
  pageIndex: any = 1;
  pageSize: any = 16;


  statusMapping = {
    0: 'Phòng đã đầy',
    1: 'Phòng còn trống',
  };

  constructor(private authenticationService: AuthenticationService, injector: Injector, private dialog: MatDialog) {
    super(injector);
  }

  ngAfterViewInit() {
    this.loadScripts('assets/js/core/app.js', 'assets/js/pages/dashboard.js');
  }

  ngOnInit(): void {
    this.loadRoom();
  }

  public loadRoom(){
    this._api.get('/api/Room/getallpaging?'
    +'pageindex=' + this.pageIndex
    +'&pagesize=' + this.pageSize
    +'&CampusId=-1'
    +'&BuildingId=-1'
    +'&Status=1'
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

  public reg(roomId:any){
    debugger;
    let obj:any = {
      RoomId: roomId,
      UserId: this.authenticationService.userValue.userId
    }
    this._api.post('/api/RoomRegistration/create/',obj).subscribe(res => {
      if (res==1) {
        this.openDialog("Đăng ký thành công", true);
      }
      if (res==2)
      {
        this.openDialog("Bạn đã đăng ký hoặc ở phòng khác rồi", false);
      }
      else {
        this.openDialog("Có lỗi xảy ra", false);
      }
    });
  }

  public openDialog(message: string, isSuccess: boolean): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '250px';
    dialogConfig.position = { top: '50px', right: '20px' };
    dialogConfig.backdropClass= 'false';
    dialogConfig.data = { message: message, isSuccess: isSuccess };
    this.dialog.open(DialogComponent, dialogConfig);
    setTimeout(() => {
      this.dialog.closeAll();
    }, 2000);
  }

}
