import { TestBed } from '@angular/core/testing';

import { PollutionAddComponent } from '../components/pollution-add/pollution-add.component.js';

describe('Pollution', () => {
  let service: PollutionAddComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PollutionAddComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
