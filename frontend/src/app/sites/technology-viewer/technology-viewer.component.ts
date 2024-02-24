import { AsyncPipe, DatePipe, NgFor, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { TechnologyService } from "@shared/services/technology/technology.service";
import { Technology } from "@shared/types/technology";
import { Observable } from "rxjs";

@Component({
  selector: "app-technology-viewer",
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, DatePipe],
  templateUrl: "./technology-viewer.component.html",
})
export class TechnologyViewerComponent {
  public technologies$: Observable<Technology[]>;

  constructor(
    private technologyService: TechnologyService,
    private router: Router
  ) {
    this.technologies$ = this.technologyService.getTechnologies();
  }

  public technologyDetails(technology: Technology) {
    this.router.navigate(["technologies", "detail", technology.id]);
  }
}
