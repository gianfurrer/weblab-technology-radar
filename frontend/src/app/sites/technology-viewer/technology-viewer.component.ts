import { Component } from "@angular/core";
import { TechnologyService } from "@shared/services/technology/technology.service";
import { Observable } from "rxjs";
import { Technology } from "@shared/types/technology";
import { AsyncPipe, DatePipe, JsonPipe, NgFor, NgIf } from "@angular/common";

@Component({
  selector: "app-technology-viewer",
  standalone: true,
  imports: [AsyncPipe, JsonPipe, NgIf, NgFor, DatePipe],
  templateUrl: "./technology-viewer.component.html",
})
export class TechnologyViewerComponent {
  public technologies$: Observable<Technology[]>;

  constructor(private technologyService: TechnologyService) {
    this.technologies$ = this.technologyService.getTechnologies();
  }
}
