import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";

import { hasRole, isLoggedOut } from "./auth.guard";

describe("authGuard", () => {
  const isLoggedOutGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isLoggedOut(...guardParameters));
  const hasRoleGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => hasRole([])(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should be created", () => {
    expect(isLoggedOutGuard).toBeTruthy();
    expect(hasRoleGuard).toBeTruthy();
  });
});
