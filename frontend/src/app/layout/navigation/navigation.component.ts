import { AsyncPipe, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { Role, User } from "@shared/types/user";
import { Observable, firstValueFrom } from "rxjs";
import { AuthService } from "@shared/services/auth/auth.service";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-navigation",
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterLink],
  templateUrl: "./navigation.component.html",
})
export class NavigationComponent {
  public currentUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.user$;
  }

  public async logout() {
    await firstValueFrom(this.authService.logout());
    this.router.navigateByUrl("/login");
  }

  public isAdmin(user: User) {
    return [Role.CTO, Role.TechLead].includes(user.role);
  }
}
