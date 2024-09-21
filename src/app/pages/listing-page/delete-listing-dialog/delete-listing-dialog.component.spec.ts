import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteListingDialogComponent } from './delete-listing-dialog.component';

describe('DeleteListingDialogComponent', () => {
  let component: DeleteListingDialogComponent;
  let fixture: ComponentFixture<DeleteListingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteListingDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteListingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
