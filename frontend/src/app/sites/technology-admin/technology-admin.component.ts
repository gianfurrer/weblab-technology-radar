import { AsyncPipe, DatePipe, NgFor, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { TechnologyService } from "@shared/services/technology/technology.service";
import { Category, Technology } from "@shared/types/technology";
import { BehaviorSubject, Observable } from "rxjs";
import { combineLatestWith, map } from "rxjs/operators";
import { AddTechnologyComponent } from "./dialogs/add-technology-dialog/add-technology-dialog.component";
import { EditTechnologyDialogComponent } from "./dialogs/edit-technology-dialog/edit-technology-dialog.component";
import { PublishOrChangeDialogComponent } from "./dialogs/publish-or-change-dialog/publish-or-change-dialog.component";

@Component({
  selector: "app-technology-admin",
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgIf,
    NgFor,
    PublishOrChangeDialogComponent,
    EditTechnologyDialogComponent,
    AddTechnologyComponent,
  ],
  templateUrl: "./technology-admin.component.html",
})
export class TechnologyAdminComponent {
  public technologies$: Observable<Technology[]>;

  public technologyToPublishOrChange?: Technology;
  public technologyToEdit?: Technology;
  public technologyToAdd?: Technology;

  private addTechnology$ = new BehaviorSubject<Technology | null>(null);

  constructor(private technologyService: TechnologyService) {
    this.technologies$ = this.addTechnology$.pipe(
      combineLatestWith(this.technologyService.getTechnologies(false)),
      map(([newTechnology, technologies]) => {
        if (!newTechnology || technologies.find(t => t.id === newTechnology.id)) {
          return technologies;
        }
        technologies.push(newTechnology);
        return technologies;
      })
    );
  }

  public addTechnology() {
    this.technologyToAdd = { name: "", description: "", category: Category.Techniques };
  }

  public technologyAdded() {
    if (!this.technologyToAdd) {
      return;
    }

    this.addTechnology$.next(this.technologyToAdd);
  }

  public publishOrChangeTechnology(technology: Technology) {
    this.technologyToPublishOrChange = technology;
  }

  public editTechnology(technology: Technology) {
    this.technologyToEdit = technology;
  }
}
