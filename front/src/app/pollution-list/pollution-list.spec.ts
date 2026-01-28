import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutionListComponent } from './pollution-list.component';

describe('PollutionList', () => {
  let component: PollutionListComponent;
  let fixture: ComponentFixture<PollutionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollutionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
