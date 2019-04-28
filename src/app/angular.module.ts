import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatGridListModule,
  MatCardModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatDialogModule,
  MatRadioModule,
  MatIconModule,
  MatCheckboxModule,
  MatInputModule,
  MatProgressSpinnerModule
 } from '@angular/material';

 import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatRadioModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatRadioModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],

})
export class AngularModule { }
