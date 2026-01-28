import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutionDeclaration } from './pollution-declaration';

describe('PollutionDeclaration', () => {
  let component: PollutionDeclaration;
  let fixture: ComponentFixture<PollutionDeclaration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionDeclaration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollutionDeclaration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
