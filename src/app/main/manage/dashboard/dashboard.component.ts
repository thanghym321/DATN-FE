import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/common/base-component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit,AfterViewInit {

  TotalCampus:any;
  TotalBuilding:any;
  Room:any;
  TotalStudent:any;
  Invoice:any;

  constructor(injector: Injector) {
    super(injector);
  }

  ngAfterViewInit() {
    this.loadScripts('assets/js/core/app.js', 'assets/js/pages/dashboard.js');
  }

  ngOnInit(): void {
    this.StatisticCampus();
    this.StatisticBuilding();
    this.StatisticRoom();
    this.StatisticStudent();
    this.StatisticInvoice();
  }

  public StatisticCampus(){
    this._api.get('/api/Statistic/StatisticCampus').subscribe(res => {
      this.TotalCampus = res;
    });
  }
  public StatisticBuilding(){
    this._api.get('/api/Statistic/StatisticBuilding').subscribe(res => {
      this.TotalBuilding = res;
    });

  }
  public StatisticRoom(){
    this._api.get('/api/Statistic/StatisticRoom').subscribe(res => {
      this.Room = res;
    });

  }
  public StatisticStudent(){
    this._api.get('/api/Statistic/StatisticStudent').subscribe(res => {
      this.TotalStudent = res;
    });

  }
  public StatisticInvoice(){
    this._api.get('/api/Statistic/StatisticInvoice').subscribe(res => {
      this.Invoice = res;
    });

  }

}
