import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  template: `
    <h1 mat-dialog-title>Message</h1>
    <div mat-dialog-content>{{data}}</div>
    <div mat-dialog-actions>
      <button class="btn btn-primary" mat-button mat-dialog-close>Close</button>
    </div>`,
})
export class ErrorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}
}
