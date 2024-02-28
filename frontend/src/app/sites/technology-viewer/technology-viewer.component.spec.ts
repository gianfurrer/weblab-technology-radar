import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { TechnologyService } from "@shared/services/technology/technology.service";
import { Category, Ring, Technology } from "@shared/types/technology";
import { routes } from "app/app.routes";
import { of } from "rxjs";
import { TechnologyViewerComponent } from "./technology-viewer.component";

const technologies: Technology[] = [
  {
    id: "1",
    name: "Category Techniques #1",
    ring: Ring.Adopt,
    category: Category.Techniques,
    description: "Description for Tech in Adopt",
  },
  {
    id: "3",
    name: "Category Techniques #3",
    ring: Ring.Hold,
    category: Category.Techniques,
    description: "Description for Tech in Hold",
  },
  {
    id: "2",
    name: "Category Techniques #2",
    ring: Ring.Trial,
    category: Category.Techniques,
    description: "Description for Tech in Trial",
  },
  {
    id: "5",
    name: "Category Tools #2",
    ring: undefined,
    category: Category.Tools,
    description: "Description for Tech without Ring",
  },
  {
    id: "4",
    name: "Category Tools #1",
    ring: Ring.Assess,
    category: Category.Tools,
    description: "Description for Tech in Assess",
  },
];

describe("TechnologyViewerComponent", () => {
  let component: TechnologyViewerComponent;
  let fixture: ComponentFixture<TechnologyViewerComponent>;
  let technologyServiceMock: jasmine.SpyObj<TechnologyService>;
  let router: Router;
  let el: HTMLElement;

  beforeEach(async () => {
    technologyServiceMock = jasmine.createSpyObj("TechnologyService", ["getTechnologies"]);
    technologyServiceMock.getTechnologies.and.returnValue(of(technologies));

    // To make sure that the initial order doesn't matter for the ordering
    technologies.sort(() => Math.random() - 0.5);

    await TestBed.configureTestingModule({
      imports: [TechnologyViewerComponent, RouterTestingModule.withRoutes(routes)],
      providers: [{ provide: TechnologyService, useValue: technologyServiceMock }],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(TechnologyViewerComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it("should render tables for existing categories and sort rows by ring level", () => {
    expect(component).toBeTruthy();
    const getTechnologyNames = (table: HTMLTableElement) =>
      Array.from(table.querySelectorAll("tbody tr td:first-child")).map(td => td.textContent);

    // Assert no section for missing category "Platforms" exist
    const renderedCategories = Array.from(el.querySelectorAll("h2"))
      .map(h => h.textContent)
      .sort();
    expect(renderedCategories).toEqual(["Techniques", "Tools"]);

    // Tools Section
    {
      const toolsTable = el.querySelector("section[data-category=Tools] table") as HTMLTableElement;
      expect(toolsTable).toBeTruthy();

      // Assert ordering of Tools Table
      expect(getTechnologyNames(toolsTable)).toEqual(["Category Tools #1", "Category Tools #2"]);
    }

    // Techniques Section
    {
      const techniquesTable = el.querySelector("section[data-category=Techniques] table") as HTMLTableElement;
      expect(techniquesTable).toBeTruthy();

      // Assert ordering of Tools Table
      expect(getTechnologyNames(techniquesTable)).toEqual([
        "Category Techniques #1",
        "Category Techniques #2",
        "Category Techniques #3",
      ]);
    }
  });

  it("should forward to Techology Details page when clicking on a row", () => {
    const navigationSpy = spyOn(router, "navigate");

    // We know that this row must be "Category Techniques #1" thanks to ordering
    const firstRow = el.querySelector("section[data-category=Techniques] table > tbody > tr") as HTMLTableRowElement;

    firstRow.click();

    expect(navigationSpy).toHaveBeenCalledWith(["technologies", "detail", "1"]);
  });
});
