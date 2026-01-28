import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutionAddComponent } from './pollution-add.component';

describe('PollutionAdd', () => {
  let component: PollutionAddComponent;
  let fixture: ComponentFixture<PollutionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollutionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
