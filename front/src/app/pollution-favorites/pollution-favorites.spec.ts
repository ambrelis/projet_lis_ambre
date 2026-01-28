import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutionFavoritesComponent } from './pollution-favorites.component';

describe('PollutionFavoritesComponent', () => {
  let component: PollutionFavoritesComponent;
  let fixture: ComponentFixture<PollutionFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionFavoritesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollutionFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
