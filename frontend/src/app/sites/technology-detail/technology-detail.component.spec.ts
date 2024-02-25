import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TechnologyDetailComponent } from "./technology-detail.component";
import { Category, Ring, Technology } from "@shared/types/technology";
import { TechnologyService } from "@shared/services/technology/technology.service";
import { of } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { routes } from "app/app.routes";
import { ActivatedRoute, Router } from "@angular/router";

describe("TechnologyDetailComponent", () => {
  let component: TechnologyDetailComponent;
  let fixture: ComponentFixture<TechnologyDetailComponent>;
  let technologyServiceMock: jasmine.SpyObj<TechnologyService>;
  let activatedRouteMock: jasmine.SpyObj<ActivatedRoute>;

  let el: HTMLElement;
  let router: Router;
  let technology: Technology;

  beforeEach(async () => {
    technology = {
      id: "1",
      name: "MyTechnology",
      category: Category.Platforms,
      ring: Ring.Assess,
      ring_reason: "Because Assess",
      description: "Outdated Description",
      created_at: new Date(),
      created_by: "test@tech-radar.ch",
      published: true,
      ring_history: [
        { changed_at: new Date(), changed_by: "test@tech-radar.ch", ring: Ring.Assess, ring_reason: "Because Assess" },
      ],
    };
    technologyServiceMock = jasmine.createSpyObj("TechnologyService", ["getTechnology"]);
    technologyServiceMock.getTechnology.and.returnValue(of(technology));

    activatedRouteMock = jasmine.createSpyObj("ActivatedRoute", ["params"]);
    activatedRouteMock.params = of({ id: technology.id });

    await TestBed.configureTestingModule({
      imports: [TechnologyDetailComponent, RouterTestingModule.withRoutes(routes)],
      providers: [
        { provide: TechnologyService, useValue: technologyServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(TechnologyDetailComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it("should display details of technology", () => {
    expect(component).toBeTruthy();
    expect(technologyServiceMock.getTechnology).toHaveBeenCalledWith(technology.id as string);
    expect(el.querySelector("h1")?.textContent).toContain(technology.name);

    const ringHistoryTable = el.querySelector("div > table");
    expect(ringHistoryTable).toBeTruthy();
    expect(ringHistoryTable?.querySelector("tbody tr td:nth-child(3)")?.textContent).toEqual(technology.ring);
  });
});
