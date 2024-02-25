import { TestBed } from "@angular/core/testing";

import { TechnologyService } from "./technology.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("TechnologyService", () => {
  let service: TechnologyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TechnologyService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
