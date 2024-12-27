import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookTypeModalComponent } from './book-type-modal.component';

describe('BookTypeModalComponent', () => {
  let component: BookTypeModalComponent;
  let fixture: ComponentFixture<BookTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookTypeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
