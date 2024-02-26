import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "@shared/services/auth/auth.service";
import { catchError, lastValueFrom, of, tap } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  public loginForm!: FormGroup;
  public submitted = false;
  public errorMessages: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  public async onSubmit() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    await lastValueFrom(
      this.authService.login(email, password).pipe(
        tap(() => {
          this.router.navigateByUrl("/technologies/radar");
        }),
        catchError(err => {
          console.error(err);
          this.errorMessages = err.error
            ? err.error.errors
              ? err.error.errors.map((e: string | { msg: string }) => (e instanceof Object ? e.msg : e))
              : [err.error]
            : [err.message];
          return of(this.errorMessages);
        })
      )
    );
  }
}
