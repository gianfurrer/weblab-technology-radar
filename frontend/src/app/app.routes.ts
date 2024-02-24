import { Routes } from "@angular/router";
import { LoginComponent } from "./sites/login/login.component";
import { TechnologyViewerComponent } from "./sites/technology-viewer/technology-viewer.component";
import { hasRole, isLoggedOut } from "@guards/auth.guard";
import { Role } from "@shared/types/user";
import { TechnologyAdminComponent } from "./sites/technology-admin/technology-admin.component";
import { TechnologyDetailComponent } from "./sites/technology-detail/technology-detail.component";

export const routes: Routes = [
  { path: "", redirectTo: "technologies/radar", pathMatch: "full" },
  { path: "login", component: LoginComponent, canActivate: [isLoggedOut] },
  {
    path: "technologies/radar",
    component: TechnologyViewerComponent,
    canActivate: [hasRole([Role.User, Role.CTO, Role.TechLead])],
  },
  {
    path: "technologies/admin",
    component: TechnologyAdminComponent,
    canActivate: [hasRole([Role.CTO, Role.TechLead])],
  },
  {
    path: "technologies/detail/:id",
    component: TechnologyDetailComponent,
    canActivate: [hasRole([Role.User, Role.CTO, Role.TechLead])],
  },
];
