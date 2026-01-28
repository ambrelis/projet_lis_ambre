import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutionDetail } from './pollution-detail.component';

describe('PollutionDetail', () => {
  let component: PollutionDetail;
  let fixture: ComponentFixture<PollutionDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollutionDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
