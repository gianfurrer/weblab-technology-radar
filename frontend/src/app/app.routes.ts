import { Routes } from "@angular/router";
import { LoginComponent } from "./sites/login/login.component";
import { TechnologyViewerComponent } from "./sites/technology-viewer/technology-viewer.component";

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "technologies", component: TechnologyViewerComponent },
];
