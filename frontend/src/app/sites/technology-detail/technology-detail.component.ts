import { AsyncPipe, DatePipe, JsonPipe, NgFor, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TechnologyService } from "@shared/services/technology/technology.service";
import { Technology } from "@shared/types/technology";
import { Observable, catchError, of, share, switchMap, tap } from "rxjs";

@Component({
  selector: "app-technology-detail",
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, AsyncPipe, JsonPipe], // FIXME: Remove JsonPipe
  templateUrl: "./technology-detail.component.html",
})
export class TechnologyDetailComponent {
  public technology$: Observable<Technology>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private technologyService: TechnologyService
  ) {
    this.technology$ = this.route.params.pipe(
      switchMap(params => {
        const id = params["id"];
        if (!id) {
          throw Error("No ID was given, can't fetch technology details.");
        }

        return this.technologyService.getTechnology(id);
      }),
      tap(technology => technology.ring_history?.sort((a, b) => (a.changed_by > b.changed_by ? -1 : 1))),
      catchError(err => {
        console.error(err.error.errors);
        this.router.navigate(["technologies", "radar"]);
        return of();
      }),
      share()
    );
  }
}
