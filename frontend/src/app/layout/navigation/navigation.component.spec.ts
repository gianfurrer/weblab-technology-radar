import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthService } from "@shared/services/auth/auth.service";
import { Role, User } from "@shared/types/user";
import { BehaviorSubject } from "rxjs";
import { NavigationComponent } from "./navigation.component";

const ctoUser: User = { id: "1234-5678", email: "cto@tech-radar.ch", role: Role.CTO };
const techLeadUser: User = { id: "8765-4321", email: "lead@tech-radar.ch", role: Role.TechLead };
const user: User = { id: "1111-2222", email: "user@tech-radar.ch", role: Role.User };

describe("NavigationComponent", () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let currentUser$: BehaviorSubject<User | null>;
  let navigationEl: DebugElement;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj("AuthService", ["user$", "logout"]);
    currentUser$ = new BehaviorSubject<User | null>(null);
    authServiceMock.user$ = currentUser$.asObservable();

    await TestBed.configureTestingModule({
      imports: [NavigationComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    navigationEl = fixture.debugElement;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should only render Technology Administration for CTO or Tech-Lead", () => {
    const adminLink = () =>
      navigationEl.queryAll(By.css("a")).find(a => a.nativeElement.textContent === "Technology Administration");

    currentUser$.next(ctoUser);
    fixture.detectChanges();
    expect(adminLink()).toBeTruthy();

    currentUser$.next(user);
    fixture.detectChanges();
    expect(adminLink()).toBeFalsy();

    currentUser$.next(techLeadUser);
    fixture.detectChanges();
    expect(adminLink()).toBeTruthy();
  });

  it("should show Login when Logged Out and E-Mail when Logged In", () => {
    const loginLink = () => navigationEl.queryAll(By.css("a")).find(a => a.nativeElement.textContent === "Login");
    const emailEl = () => navigationEl.query(By.css("#display-email"));

    // Logged Out -> Show Login Button
    currentUser$.next(null);
    fixture.detectChanges();
    expect(loginLink()).toBeTruthy();
    expect(emailEl()).toBeFalsy();

    // Logged In -> Show User E-Mail
    currentUser$.next(user);
    fixture.detectChanges();
    expect(loginLink()).toBeFalsy();
    expect(emailEl()).toBeTruthy();
    expect(emailEl().nativeElement.textContent).toBe(user.email);
  });
});
