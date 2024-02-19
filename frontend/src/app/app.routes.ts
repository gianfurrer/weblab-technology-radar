import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { TechnologyViewerComponent } from "./technology-viewer/technology-viewer.component";

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "technologies", component: TechnologyViewerComponent },
];
