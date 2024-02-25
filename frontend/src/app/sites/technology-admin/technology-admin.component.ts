import { AsyncPipe, DatePipe, NgFor, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { TechnologyService } from "@shared/services/technology/technology.service";
import { Technology } from "@shared/types/technology";
import { Observable } from "rxjs";
import { PublishOrChangeDialogComponent } from "./dialogs/publish-or-change-dialog/publish-or-change-dialog.component";
import { EditTechnologyDialogComponent } from "./dialogs/edit-technology-dialog/edit-technology-dialog.component";

@Component({
  selector: "app-technology-admin",
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgIf, NgFor, PublishOrChangeDialogComponent, EditTechnologyDialogComponent],
  templateUrl: "./technology-admin.component.html",
})
export class TechnologyAdminComponent {
  public technologies$: Observable<Technology[]>;

  public technologyToPublishOrChange?: Technology;
  public technologyToEdit?: Technology;

  constructor(private technologyService: TechnologyService) {
    this.technologies$ = this.technologyService.getTechnologies(false);
  }

  public publishOrChangeTechnology(technology: Technology) {
    this.technologyToPublishOrChange = technology;
  }

  public editTechnology(technology: Technology) {
    this.technologyToEdit = technology;
  }
}
