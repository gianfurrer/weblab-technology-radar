import { AsyncPipe, DatePipe, KeyValuePipe, NgFor, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { TechnologyService } from "@shared/services/technology/technology.service";
import { Category, Technology } from "@shared/types/technology";
import { Observable, map } from "rxjs";
import { SortByRingPipe } from "./sort-by-ring.pipe";

@Component({
  selector: "app-technology-viewer",
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, DatePipe, KeyValuePipe, SortByRingPipe],
  templateUrl: "./technology-viewer.component.html",
})
export class TechnologyViewerComponent {
  public technologies$: Observable<Technology[]>;
  public groupedTechnologies$: Observable<Map<Category, Technology[]>>;

  constructor(
    private technologyService: TechnologyService,
    private router: Router
  ) {
    this.technologies$ = this.technologyService.getTechnologies();
    this.groupedTechnologies$ = this.technologies$.pipe(
      map(technologies => {
        return Map.groupBy(technologies, technology => technology.category);
      })
    );
  }

  public technologyDetails(technology: Technology) {
    this.router.navigate(["technologies", "detail", technology.id]);
  }
}
