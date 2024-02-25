import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TechnologyAdminComponent } from "./technology-admin.component";
import { TechnologyService } from "@shared/services/technology/technology.service";
import { Category, Ring, Technology } from "@shared/types/technology";
import { distinctUntilChanged, of } from "rxjs";

const technologies: Technology[] = [
  {
    id: "1",
    name: "Category Techniques #1",
    ring: Ring.Adopt,
    category: Category.Techniques,
    description: "Description for Tech in Adopt",
    created_at: new Date(),
    created_by: "test@tech-radar.com",
    published: true,
    published_at: new Date(),
  },
  {
    id: "3",
    name: "Category Techniques #3",
    ring: Ring.Hold,
    category: Category.Techniques,
    description: "Description for Tech in Hold",
    created_at: new Date(),
    created_by: "test@tech-radar.com",
    published: false,
  },
  {
    id: "2",
    name: "Category Techniques #2",
    ring: Ring.Trial,
    category: Category.Techniques,
    description: "Description for Tech in Trial",
    created_at: new Date(),
    created_by: "test@tech-radar.com",
    published: false,
  },
  {
    id: "5",
    name: "Category Tools #2",
    ring: undefined,
    category: Category.Tools,
    description: "Description for Tech without Ring",
    created_at: new Date(),
    created_by: "test@tech-radar.com",
    published: false,
  },
  {
    id: "4",
    name: "Category Tools #1",
    ring: Ring.Assess,
    category: Category.Tools,
    description: "Description for Tech in Assess",
    created_at: new Date(),
    created_by: "test@tech-radar.com",
    published: true,
    published_at: new Date(),
  },
];

describe("TechnologyAdminComponent", () => {
  let component: TechnologyAdminComponent;
  let fixture: ComponentFixture<TechnologyAdminComponent>;
  let technologyServiceMock: jasmine.SpyObj<TechnologyService>;
  let el: HTMLElement;

  // HTML Elements
  let table: HTMLTableElement;

  beforeEach(async () => {
    technologyServiceMock = jasmine.createSpyObj("TechnologyService", ["getTechnologies"]);
    technologyServiceMock.getTechnologies.and.returnValue(of(technologies));

    await TestBed.configureTestingModule({
      imports: [TechnologyAdminComponent],
      providers: [{ provide: TechnologyService, useValue: technologyServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyAdminComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();

    table = el.querySelector("table") as HTMLTableElement;
  });

  it("should show a table with all technologies", () => {
    expect(component).toBeTruthy();

    const rows = Array.from(table.querySelectorAll("tbody tr"));
    expect(rows.length).toEqual(technologies.length);

    const aTechnology = technologies[0];
    const row = rows.find(r => r.children[0].textContent === aTechnology.name);
    expect(row).toBeTruthy();

    const columns = row?.children as HTMLCollection;
    expect(columns[1].textContent).toEqual(aTechnology.category);
    expect(columns[2].textContent).toEqual(aTechnology.ring as string);
  });

  it("should show and open publish-dialog for unpublished technologies", () => {
    expect(component).toBeTruthy();

    const rows = Array.from(table.querySelectorAll("tbody tr"));
    expect(rows.length).toEqual(technologies.length);

    const unpublishedTechnology = technologies.find(t => !t.published) as Technology;
    const row = rows.find(r => r.children[0].textContent === unpublishedTechnology.name);
    expect(row).toBeTruthy();

    const actionColumn = row?.children[6] as HTMLElement;
    const publishButton = Array.from(actionColumn?.querySelectorAll("button")).find(
      b => b.textContent?.trim() === "Publish"
    ) as HTMLButtonElement;
    expect(publishButton).toBeTruthy();

    publishButton.click();
    fixture.detectChanges();

    const dialog = el.querySelector("app-publish-or-change-dialog dialog") as HTMLDialogElement;
    expect(dialog.open).toBeTruthy();
  });

  it("should show and open edit-dialog for all technologies", () => {
    expect(component).toBeTruthy();

    const rows = Array.from(table.querySelectorAll("tbody tr"));
    expect(rows.length).toEqual(technologies.length);

    const someTechnology = technologies[0] as Technology;
    const row = rows.find(r => r.children[0].textContent === someTechnology.name);
    expect(row).toBeTruthy();

    const actionColumn = row?.children[6] as HTMLElement;
    const editBtn = Array.from(actionColumn?.querySelectorAll("button")).find(
      b => b.textContent?.trim() === "Edit"
    ) as HTMLButtonElement;
    expect(editBtn).toBeTruthy();

    editBtn.click();
    fixture.detectChanges();

    const dialog = el.querySelector("app-edit-technology-dialog dialog") as HTMLDialogElement;
    expect(dialog.open).toBeTruthy();
  });
});
