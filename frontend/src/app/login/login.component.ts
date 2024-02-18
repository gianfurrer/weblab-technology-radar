import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { LoginService } from "./login.service";
import { catchError, lastValueFrom, of, tap } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  public loginForm!: FormGroup;
  public submitted = false;
  public errorMessage?: string;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  public async onSubmit() {
    this.submitted = true;
    this.errorMessage = "";

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    await lastValueFrom(
      this.loginService.login(email, password).pipe(
        tap(() => {
          console.log("Success! Redirecting");
          this.router.navigateByUrl("/technologies");
        }),
        catchError(err => {
          console.log(err);
          this.errorMessage = err.error ?? err.message;
          return of(this.errorMessage);
        })
      )
    );
  }
}
