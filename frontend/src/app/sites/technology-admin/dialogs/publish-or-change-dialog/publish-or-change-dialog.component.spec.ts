import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PublishOrChangeDialogComponent } from "./publish-or-change-dialog.component";
import { TechnologyService } from "@shared/services/technology/technology.service";
import { Category, PublishDetails, Ring, Technology } from "@shared/types/technology";
import { SimpleChange } from "@angular/core";
import { of } from "rxjs";
import { setFieldElementValue } from "app/spec-helpers/element.spec-helper";

describe("PublishOrChangeDialogComponent", () => {
  let component: PublishOrChangeDialogComponent;
  let fixture: ComponentFixture<PublishOrChangeDialogComponent>;
  let technologyServiceMock: jasmine.SpyObj<TechnologyService>;
  let el: HTMLElement;
  let technology: Technology;

  // HTML Elements
  let dialog: HTMLDialogElement;
  let ringInput: HTMLSelectElement;
  let ringReasonInput: HTMLTextAreaElement;
  let submitBtn: HTMLButtonElement;

  beforeEach(async () => {
    technology = {
      id: "1",
      name: "MyTechnology",
      category: Category.Platforms,
      description: "Up to date description",
      ring: Ring.Hold,
      ring_reason: "Bacause Hold",
      published: false,
    };
    technologyServiceMock = jasmine.createSpyObj("TechnologyService", ["publishTechnology"]);

    await TestBed.configureTestingModule({
      imports: [PublishOrChangeDialogComponent],
      providers: [{ provide: TechnologyService, useValue: technologyServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(PublishOrChangeDialogComponent);
    component = fixture.componentInstance;
    component.technology = technology;
    el = fixture.nativeElement;
    fixture.detectChanges();

    component.ngOnChanges({
      technology: new SimpleChange(null, technology, true),
    });
    fixture.detectChanges();

    dialog = component.dialogRef.nativeElement;
    ringInput = el.querySelector("select[name=ring]") as HTMLSelectElement;
    ringReasonInput = el.querySelector("textarea[name=ring_reason]") as HTMLTextAreaElement;
    submitBtn = el.querySelector("button[type=submit]") as HTMLButtonElement;
  });

  it("should load existing values into form", () => {
    expect(component).toBeTruthy();
    expect(dialog.open).toBeTruthy();

    expect(ringInput.value).toEqual(technology.ring as string);
    expect(ringReasonInput.value).toEqual(technology.ring_reason as string);

    const publishDetails: PublishDetails = {
      id: technology.id as string,
      ring: technology.ring as Ring,
      ring_reason: technology.ring_reason as string,
      publish: true,
    };

    submitBtn.click();
    expect(technologyServiceMock.publishTechnology).toHaveBeenCalledWith(publishDetails);
  });

  it("should update technology object and close the dialog on (successful) submit", () => {
    const publishDetails: PublishDetails = {
      id: technology.id as string,
      ring: Ring.Assess,
      ring_reason: "It's not in Assess",
      publish: true,
    };
    const returnedTechology: Technology = { ...technology, ...publishDetails, published_at: new Date() };
    returnedTechology.published = publishDetails.publish;
    technologyServiceMock.publishTechnology.and.returnValue(of(returnedTechology));

    setFieldElementValue(ringInput, publishDetails.ring);
    setFieldElementValue(ringReasonInput, publishDetails.ring_reason);
    submitBtn.click();
    fixture.detectChanges();
    expect(technologyServiceMock.publishTechnology).toHaveBeenCalledWith(publishDetails);
    expect(dialog.open).toBeFalsy();
    // Expect that the technolgy object is updated to the http response object
    expect(component.technology).toEqual(returnedTechology);
  });

  it("should not submit with errors", () => {
    setFieldElementValue(ringReasonInput, "");
    submitBtn.click();
    fixture.detectChanges();

    expect(technologyServiceMock.publishTechnology.calls.count()).toEqual(0);
    expect(ringReasonInput.parentElement?.querySelector("div > div")?.textContent).toEqual(
      "A Ring Description is required!"
    );
  });
});
