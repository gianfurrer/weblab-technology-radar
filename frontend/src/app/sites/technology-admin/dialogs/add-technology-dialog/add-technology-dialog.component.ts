import { NgFor, NgIf } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { TechnologyService } from "@shared/services/technology/technology.service";
import { Technology } from "@shared/types/technology";
import { DialogBaseComponent } from "app/sites/technology-admin/dialogs/dialog-base.component";
import { catchError, firstValueFrom, of, tap } from "rxjs";

@Component({
  selector: "app-add-technology-dialog",
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: "./add-technology-dialog.component.html",
})
export class AddTechnologyComponent extends DialogBaseComponent implements OnChanges {
  @Input() technology?: Technology;

  public addForm?: FormGroup;
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
      this.addForm = this.formBuilder.group({
        name: ["", [Validators.required]],
        category: ["", [Validators.required, Validators.pattern(/(Platforms|Techniques|Tools)/)]],
        description: ["", [Validators.required]],
        ring: ["", [Validators.pattern(/(Adopt|Trial|Assess|Hold)/)]],
        ring_reason: ["", []],
      });
    }
  }

  public async onSubmit() {
    this.submitted = true;
    if (!this.addForm?.valid || !this.technology) {
      return;
    }

    const body = this.addForm.value;
    Object.keys(body).forEach(key => {
      if (body[key] === "") {
        delete body[key];
      }
    });

    await firstValueFrom(
      this.technologyService.addTechnology(body as Technology).pipe(
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
    this.addForm = undefined;
    this.errorMessages = [];
  }
}
