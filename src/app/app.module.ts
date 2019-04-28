import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { SettingsManagerComponent } from './settings-manager/settings-manager.component';
import { ReportComponent } from './report/report.component';
import { AngularModule } from './angular.module';
import { FileSelectDirective } from 'ng2-file-upload';

@NgModule({
  declarations: [
    AppComponent,
    FileManagerComponent,
    SettingsManagerComponent,
    ReportComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    AngularModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
