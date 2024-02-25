import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LoginComponent } from "./login.component";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthService } from "@shared/services/auth/auth.service";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { setFieldElementValue } from "app/spec-helpers/element.spec-helper";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let el: HTMLElement;

  // HTMLElements
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let submitBtn: HTMLButtonElement;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj("AuthService", ["login"]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();

    emailInput = el.querySelector("#email") as HTMLInputElement;
    passwordInput = el.querySelector("#password") as HTMLInputElement;
    submitBtn = el.querySelector("button[type=submit]") as HTMLButtonElement;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should only show errors after first submission", () => {
    const errors = () => el.querySelector(".errors");

    // Don't immediately show errors
    setFieldElementValue(emailInput, "");
    setFieldElementValue(passwordInput, "");
    fixture.detectChanges();
    expect(errors()).toBeFalsy();

    // Show errors after trying to Submit
    submitBtn.click();
    fixture.detectChanges();
    expect(errors()).toBeTruthy();

    // Errors should dissapear immediately after fixing them
    setFieldElementValue(emailInput, "valid@email.com");
    setFieldElementValue(passwordInput, "somepassword");
    fixture.detectChanges();
    expect(errors()).toBeFalsy();
  });

  it("should check for min password and valid email", () => {
    const errors = () => Array.from(el.querySelectorAll(".errors div")).flat();

    setFieldElementValue(emailInput, "InvalidEmail");
    setFieldElementValue(passwordInput, "shortpw");
    submitBtn.click();
    fixture.detectChanges();
    console.log(el.querySelectorAll(".errors"), emailInput.value, passwordInput.value);
    expect(errors().find(el => el.textContent === "Password must be at least 8 characters")).toBeTruthy();
    expect(errors().find(el => el.textContent === "Email must be a valid email address")).toBeTruthy();
  });

  it("should call AuthService.login on submit", () => {
    const validEmail = "valid@email.com";
    const validPassword = "somepassword";
    setFieldElementValue(emailInput, validEmail);
    setFieldElementValue(passwordInput, validPassword);
    submitBtn.click();
    fixture.detectChanges();

    expect(authServiceMock.login).toHaveBeenCalledWith(validEmail, validPassword);
  });
});
