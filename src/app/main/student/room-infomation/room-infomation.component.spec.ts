import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomInfomationComponent } from './room-infomation.component';

describe('RoomInfomationComponent', () => {
  let component: RoomInfomationComponent;
  let fixture: ComponentFixture<RoomInfomationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomInfomationComponent]
    });
    fixture = TestBed.createComponent(RoomInfomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
