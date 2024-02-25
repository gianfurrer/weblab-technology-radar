import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditTechnologyDialogComponent } from "./edit-technology-dialog.component";
import { TechnologyService } from "@shared/services/technology/technology.service";
import { Category, Technology } from "@shared/types/technology";
import { SimpleChange } from "@angular/core";
import { setFieldElementValue } from "app/spec-helpers/element.spec-helper";
import { of } from "rxjs";

describe("EditTechnologyDialogComponent", () => {
  let component: EditTechnologyDialogComponent;
  let fixture: ComponentFixture<EditTechnologyDialogComponent>;
  let technologyServiceMock: jasmine.SpyObj<TechnologyService>;
  let el: HTMLElement;
  let technology: Technology;

  // HTML Elements
  let nameInput: HTMLInputElement;
  let categoryInput: HTMLSelectElement;
  let descriptionInput: HTMLTextAreaElement;
  let submitBtn: HTMLButtonElement;
  let dialog: HTMLDialogElement;

  beforeEach(async () => {
    technology = {
      id: "1",
      name: "MyTechnology",
      category: Category.Platforms,
      description: "Outdated Description",
    };
    technologyServiceMock = jasmine.createSpyObj("TechnologyService", ["editTechnology"]);

    await TestBed.configureTestingModule({
      imports: [EditTechnologyDialogComponent],
      providers: [{ provide: TechnologyService, useValue: technologyServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTechnologyDialogComponent);
    component = fixture.componentInstance;
    component.technology = technology;
    el = fixture.nativeElement;
    fixture.detectChanges();

    component.ngOnChanges({
      technology: new SimpleChange(null, technology, true),
    });
    fixture.detectChanges();

    dialog = component.dialogRef.nativeElement;
    nameInput = el.querySelector("input[name=name]") as HTMLInputElement;
    categoryInput = el.querySelector("select[name=category]") as HTMLSelectElement;
    descriptionInput = el.querySelector("textarea[name=description]") as HTMLTextAreaElement;
    submitBtn = el.querySelector("button[type=submit]") as HTMLButtonElement;
  });

  it("should load existing values into form", () => {
    expect(component).toBeTruthy();
    expect(dialog.open).toBeTruthy();

    expect(nameInput.value).toEqual(technology.name);
    expect(categoryInput.value).toEqual(technology.category);
    expect(descriptionInput.value).toEqual(technology.description);

    submitBtn.click();
    expect(technologyServiceMock.editTechnology).toHaveBeenCalledWith(technology);
  });

  it("should update technology object and close the dialog on (successful) submit", () => {
    const updatedTechnology: Technology = {
      id: technology.id,
      name: "MyNewTechnology",
      category: Category.Techniques,
      description: "Up to date description",
    };
    const returnedTechology = { ...updatedTechnology, changed_by: "test@tech-radar.ch" };
    technologyServiceMock.editTechnology.and.returnValue(of(returnedTechology));

    setFieldElementValue(nameInput, updatedTechnology.name);
    setFieldElementValue(categoryInput, updatedTechnology.category);
    setFieldElementValue(descriptionInput, updatedTechnology.description);
    submitBtn.click();
    fixture.detectChanges();
    expect(technologyServiceMock.editTechnology).toHaveBeenCalledWith(updatedTechnology);
    expect(dialog.open).toBeFalsy();
    // Expect that the technolgy object is updated to the http response object
    expect(component.technology).toEqual(returnedTechology);
  });

  it("should not submit with errors", () => {
    setFieldElementValue(nameInput, "");
    submitBtn.click();
    fixture.detectChanges();

    expect(technologyServiceMock.editTechnology.calls.count()).toEqual(0);
    expect(nameInput.parentElement?.querySelector("div > div")?.textContent).toEqual("A Name is required");
  });
});
