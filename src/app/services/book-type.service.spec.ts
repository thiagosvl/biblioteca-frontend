import { TestBed } from '@angular/core/testing';

import { BookTypeService } from './book-type.service';

describe('BookTypeService', () => {
  let service: BookTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
