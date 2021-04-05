import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { NgxDragdropGridPresenter } from './dragdrop-grid.presenter';
import {  NgxDragdropGridComponent} from './dragdrop-grid.component';
import { NgxDragAndDropListDirective } from './drag-and-drop-list.directive';
import { NgxDragAndDropContentOutletDirective } from './drag-and-drop-content-outlet.directive';

@NgModule({
  declarations: [
    NgxDragdropGridComponent,
    NgxDragAndDropListDirective,
    NgxDragAndDropContentOutletDirective
  ],
  imports: [CommonModule, DragDropModule],
  exports: [
    DragDropModule,
    NgxDragdropGridComponent,
    NgxDragAndDropListDirective,
    NgxDragAndDropContentOutletDirective
  ],
  providers: [NgxDragdropGridPresenter],
})
export class NgxDragdropGridModule {
}
