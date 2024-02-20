import { AsyncPipe, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { User } from "@shared/types/user";
import { Observable } from "rxjs";
import { AuthService } from "@shared/services/auth/auth.service";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-navigation",
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterLink],
  templateUrl: "./navigation.component.html",
})
export class NavigationComponent {
  public currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.getUser();
  }
}
