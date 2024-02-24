import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PublishOrChangeDialogComponent } from "./publish-or-change-dialog.component";

describe("PublishDialogComponent", () => {
  let component: PublishOrChangeDialogComponent;
  let fixture: ComponentFixture<PublishOrChangeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishOrChangeDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublishOrChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
