import { AsyncPipe, DatePipe, NgFor, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { TechnologyService } from "@shared/services/technology/technology.service";
import { Technology } from "@shared/types/technology";
import { Observable } from "rxjs";
import { PublishDialogComponent } from "./dialogs/publish-dialog/publish-dialog.component";
import { EditTechnologyDialogComponent } from "./dialogs/edit-technology-dialog/edit-technology-dialog.component";

@Component({
  selector: "app-technology-admin",
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgIf, NgFor, PublishDialogComponent, EditTechnologyDialogComponent],
  templateUrl: "./technology-admin.component.html",
})
export class TechnologyAdminComponent {
  public technologies$: Observable<Technology[]>;

  public technologyToPublish?: Technology;
  public technologyToEdit?: Technology;

  constructor(private technologyService: TechnologyService) {
    this.technologies$ = this.technologyService.getTechnologies();
  }

  public publishTechnology(technology: Technology) {
    this.technologyToPublish = technology;
  }

  public editTechnology(technology: Technology) {
    this.technologyToEdit = technology;
  }
}
