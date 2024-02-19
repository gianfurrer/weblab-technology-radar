import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { AuthService } from "./shared/services/auth/auth.service";
import { Observable } from "rxjs";
import { User } from "./shared/types/user";
import { AsyncPipe, NgIf } from "@angular/common";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, AsyncPipe, NgIf],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  public currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.getUser();
  }
}
