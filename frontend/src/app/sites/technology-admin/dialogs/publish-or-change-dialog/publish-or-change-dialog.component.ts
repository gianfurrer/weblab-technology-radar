import { NgFor, NgIf } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DialogBaseComponent } from "@shared/components/dialog-base.component";
import { TechnologyService } from "@shared/services/technology/technology.service";
import { PublishDetails, Technology } from "@shared/types/technology";
import { catchError, firstValueFrom, of, tap } from "rxjs";

@Component({
  selector: "app-publish-or-change-dialog",
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: "./publish-or-change-dialog.component.html",
})
export class PublishOrChangeDialogComponent extends DialogBaseComponent implements OnChanges {
  @Input() technology?: Technology;

  public publishForm?: FormGroup;
  public submitted = false;
  public errorMessages = "";

  constructor(
    private formBuilder: FormBuilder,
    private technologyService: TechnologyService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["technology"] && this.technology) {
      this.dialog.showModal();
      this.publishForm = this.formBuilder.group({
        ring: [this.technology.ring?.toString() ?? "", [Validators.required]],
        ring_reason: [this.technology.ring_reason, [Validators.required]],
        publish: [true, [Validators.required]],
      });
    }
  }

  public async onSubmit() {
    this.submitted = true;
    if (!this.publishForm?.valid || !this.technology) {
      return;
    }

    const body: PublishDetails = this.publishForm.getRawValue();
    body.id = this.technology.id ?? "";

    await firstValueFrom(
      this.technologyService.publishTechnology(body).pipe(
        tap((response: Technology) => {
          if (this.technology) {
            Object.assign(this.technology, response);
          }
          this.close();
        }),
        catchError(err => {
          console.error(err);
          this.errorMessages = err.error ? (err.error.errors ? err.error.errors : [err.error]) : [err.message];
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
    this.publishForm = undefined;
  }
}
