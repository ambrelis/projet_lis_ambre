import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutionEdit } from './pollution-edit.component';

describe('PollutionEdit', () => {
  let component: PollutionEdit;
  let fixture: ComponentFixture<PollutionEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollutionEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
