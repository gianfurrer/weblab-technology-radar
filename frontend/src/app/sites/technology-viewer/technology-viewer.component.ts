import { AsyncPipe, DatePipe, NgFor, NgIf } from "@angular/common";
import { Component } from "@angular/core";
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

  constructor(private technologyService: TechnologyService) {
    this.technologies$ = this.technologyService.getTechnologies();
  }
}
