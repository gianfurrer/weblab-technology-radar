import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from "@angular/core";

@Component({
  template: ``,
})
export abstract class DialogBaseComponent implements AfterViewInit {
  @ViewChild("dialog") dialogRef!: ElementRef;
  protected get dialog(): HTMLDialogElement {
    return this.dialogRef.nativeElement;
  }
  @Output() closeDialog = new EventEmitter();

  ngAfterViewInit() {
    this.dialog.onclose = () => {
      this.closeDialog.emit();
      this.close();
    };
  }

  public close(): void {
    console.error("close not implemeneted");
  }
}
