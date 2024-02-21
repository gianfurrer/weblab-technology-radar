import { Routes } from "@angular/router";
import { hasRole, isLoggedOut } from "@guards/auth.guard";
import { Role } from "@shared/types/user";
import { LoginComponent } from "./sites/login/login.component";
import { TechnologyViewerComponent } from "./sites/technology-viewer/technology-viewer.component";

export const routes: Routes = [
  { path: "login", component: LoginComponent, canActivate: [isLoggedOut] },
  {
    path: "technologies",
    component: TechnologyViewerComponent,
    canActivate: [hasRole([Role.User, Role.CTO, Role.TechLead])],
  },
];
