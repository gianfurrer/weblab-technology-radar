import { NgFor, NgIf } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DialogBaseComponent } from "app/sites/technology-admin/dialogs/dialog-base.component";
import { TechnologyService } from "@shared/services/technology/technology.service";
import { Technology } from "@shared/types/technology";
import { catchError, firstValueFrom, of, tap } from "rxjs";

@Component({
  selector: "app-edit-technology-dialog",
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: "./edit-technology-dialog.component.html",
})
export class EditTechnologyDialogComponent extends DialogBaseComponent implements OnChanges {
  @Input() technology?: Technology;

  public editForm?: FormGroup;
  public submitted = false;
  public errorMessages: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private technologyService: TechnologyService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["technology"] && this.technology) {
      this.dialog.showModal();
      this.editForm = this.formBuilder.group({
        name: [this.technology.name, [Validators.required]],
        category: [
          this.technology.category,
          [Validators.required, Validators.pattern(/(Platforms|Techniques|Tools|Languages & Frameworks)/)],
        ],
        description: [this.technology.description, [Validators.required]],
      });
    }
  }

  public async onSubmit() {
    this.submitted = true;
    if (!this.editForm?.valid || !this.technology) {
      return;
    }

    const body: Technology = this.editForm.getRawValue();
    body.id = this.technology.id ?? "";

    await firstValueFrom(
      this.technologyService.editTechnology(body).pipe(
        tap((response: Technology) => {
          if (this.technology) {
            Object.assign(this.technology, response);
          }
          this.close();
        }),
        catchError(err => {
          console.error(err);
          this.errorMessages = err.error
            ? err.error.errors
              ? err.error.errors.map((e: string | { msg: string }) => (e instanceof Object ? e.msg : e))
              : [err.error]
            : [err.message];
          return of(this.errorMessages);
        })
      )
    );
  }

  public override close() {
    if (this.dialog.open) {
      this.dialog.close();
    }
    this.submitted = false;
    this.editForm = undefined;
    this.errorMessages = [];
  }
}
