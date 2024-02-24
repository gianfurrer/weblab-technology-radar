import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTechnologyDialogComponent } from './edit-technology-dialog.component';

describe('EditTechnologyDialogComponent', () => {
  let component: EditTechnologyDialogComponent;
  let fixture: ComponentFixture<EditTechnologyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTechnologyDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTechnologyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
