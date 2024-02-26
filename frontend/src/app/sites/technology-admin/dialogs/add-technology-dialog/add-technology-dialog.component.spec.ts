import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddTechnologyComponent } from "./add-technology-dialog.component";
import { TechnologyService } from "@shared/services/technology/technology.service";
import { Category, Ring, Technology } from "@shared/types/technology";
import { SimpleChange } from "@angular/core";
import { setFieldElementValue } from "app/spec-helpers/element.spec-helper";
import { of } from "rxjs";

describe("AddTechnologyComponent", () => {
  let component: AddTechnologyComponent;
  let fixture: ComponentFixture<AddTechnologyComponent>;
  let technologyServiceMock: jasmine.SpyObj<TechnologyService>;
  let el: HTMLElement;
  let technology: Technology;

  // HTML Elements
  let nameInput: HTMLInputElement;
  let categoryInput: HTMLSelectElement;
  let descriptionInput: HTMLTextAreaElement;
  let ringInput: HTMLSelectElement;
  let ringReasonInput: HTMLTextAreaElement;
  let submitBtn: HTMLButtonElement;
  let dialog: HTMLDialogElement;

  beforeEach(async () => {
    technology = { name: "", category: Category.Techniques, description: "" };
    technologyServiceMock = jasmine.createSpyObj("TechnologyService", ["addTechnology"]);

    await TestBed.configureTestingModule({
      imports: [AddTechnologyComponent],
      providers: [{ provide: TechnologyService, useValue: technologyServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTechnologyComponent);
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
    ringInput = el.querySelector("select[name=ring]") as HTMLSelectElement;
    ringReasonInput = el.querySelector("textarea[name=ring_reason]") as HTMLTextAreaElement;
    submitBtn = el.querySelector("button[type=submit]") as HTMLButtonElement;
  });

  it("should not have preexising values in the form", () => {
    expect(component).toBeTruthy();
    expect(dialog.open).toBeTruthy();

    expect(nameInput.value).toBeFalsy();
    expect(categoryInput.value).toBeFalsy();
    expect(descriptionInput.value).toBeFalsy();
    expect(ringInput.value).toBeFalsy();
    expect(ringReasonInput.value).toBeFalsy();
  });

  it("should not submit when required entries are missing", () => {
    const errors = (input: HTMLElement) =>
      Array.from((input.parentElement as HTMLElement).querySelectorAll(".errors div")).map(e => e.textContent);

    // Missing Name
    {
      setFieldElementValue(nameInput, "");
      setFieldElementValue(categoryInput, Category.Platforms);
      setFieldElementValue(descriptionInput, "Description");
      submitBtn.click();
      fixture.detectChanges();
      expect(errors(nameInput)[0]).toBe("A Name is required");
    }

    // Missing Category
    {
      setFieldElementValue(nameInput, "MyTechnology");
      setFieldElementValue(categoryInput, "");
      setFieldElementValue(descriptionInput, "Description");
      submitBtn.click();
      fixture.detectChanges();
      expect(errors(categoryInput)[0]).toBe("A Category is required");
    }

    // Missing Description
    {
      setFieldElementValue(nameInput, "MyTechnology");
      setFieldElementValue(categoryInput, Category.Platforms);
      setFieldElementValue(descriptionInput, "");
      submitBtn.click();
      fixture.detectChanges();
      expect(errors(descriptionInput)[0]).toBe("A Description is required!");
    }
  });

  it("should submit when all required values are set", () => {
    const technology: Technology = {
      name: "MyTechnology",
      category: Category.Techniques,
      description: "Description",
    };
    const returnedTechology = { ...technology, id: "1", created_by: "test@tech.ch" };
    technologyServiceMock.addTechnology.and.returnValue(of(returnedTechology));

    setFieldElementValue(nameInput, technology.name);
    setFieldElementValue(categoryInput, technology.category);
    setFieldElementValue(descriptionInput, technology.description);
    submitBtn.click();
    fixture.detectChanges();

    expect(el.querySelectorAll(".errors").length).toBe(0);
    expect(technologyServiceMock.addTechnology).toHaveBeenCalledWith(technology);
    expect(dialog.open).toBeFalsy();
    // Expect that the technolgy object is updated to the http response object
    expect(component.technology).toEqual(returnedTechology);
  });

  it("should include optional values if set", () => {
    const technology: Technology = {
      name: "MyTechnology",
      category: Category.Techniques,
      description: "Description",
      ring: Ring.Adopt,
      ring_reason: "Because",
    };
    const returnedTechology = { ...technology, id: "1", created_by: "test@tech.ch" };
    technologyServiceMock.addTechnology.and.returnValue(of(returnedTechology));

    setFieldElementValue(nameInput, technology.name);
    setFieldElementValue(categoryInput, technology.category);
    setFieldElementValue(descriptionInput, technology.description);
    setFieldElementValue(ringInput, technology.ring as Ring);
    setFieldElementValue(ringReasonInput, technology.ring_reason as string);
    submitBtn.click();
    fixture.detectChanges();

    expect(el.querySelectorAll(".errors").length).toBe(0);
    expect(technologyServiceMock.addTechnology).toHaveBeenCalledWith(technology);
    expect(dialog.open).toBeFalsy();
    // Expect that the technolgy object is updated to the http response object
    expect(component.technology).toEqual(returnedTechology);
  });
});
