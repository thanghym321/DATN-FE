import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { BaseComponent } from 'src/app/core/common/base-component';
import { DialogComponent } from 'src/app/shared/components/Dialog/Dialog.component';


@Component({
  selector: 'app-room-infomation',
  templateUrl: './room-infomation.component.html',
  styleUrls: ['./room-infomation.component.css']
})
export class RoomInfomationComponent extends BaseComponent implements OnInit,AfterViewInit {

  list_userInRoom: any;
  totalUserInRoom: any;
  pageIndex: any = 1;
  pageSize: any = 5;
  room: any;

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
    this.loadUserInRoom();
    this.loadRoom();
  }

  public loadRoom(){
    debugger;
    this._api.get('/api/Room/GetRoomByUserId/' + this.authenticationService.userValue.userId
    ).subscribe(res => {
      this.room = res;
      console.log(this.room)
    });
  }

  public loadUserInRoom(){
    this._api.get('/api/Room/GetAllPagingUserInRoom?'
    +'pageindex=' + this.pageIndex
    +'&pagesize=' + this.pageSize
    +'&Id=' + this.authenticationService.userValue.userId
    ).subscribe(res => {
      this.list_userInRoom = res.items;
      this.totalUserInRoom=res.totalItem;
      console.log(this.list_userInRoom)

    });
  }

  public loadPageIndex(pageIndex: any) {
    this.pageIndex=pageIndex;
    this.loadUserInRoom();
  }

  public loadPageSize(pageSize:any) {
    this.pageIndex=1;
    this.pageSize=pageSize;
    this.loadUserInRoom();
  }

  public leave(){
    debugger;
    this._api.get('/api/RoomRegistration/SendMailLeave?'
    +'Email=' + this.authenticationService.userValue.email
    +'&Id='+ this.authenticationService.userValue.userId
    ).subscribe(res => {
      if(res==1){
        alert("Kiểm tra đường link gửi tới mail của ban")
      }
      else{
        alert("Có lỗi xảy ra")
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
