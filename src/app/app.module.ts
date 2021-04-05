import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// @ts-ignore
import { NgxDragdropGridModule } from '@zvs/ngx-dragdrop-grid';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxDragdropGridModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
