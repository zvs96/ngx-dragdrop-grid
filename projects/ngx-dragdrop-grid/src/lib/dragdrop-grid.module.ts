import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { NgxDragdropGridPresenter } from './dragdrop-grid.presenter';
import {
  NgxDragAndDropListDataDirective,
  NgxDragDropContentOutletDirective,
  NgxDragdropGridComponent
} from './dragdrop-grid.component';

@NgModule({
  declarations: [
    NgxDragdropGridComponent,
    NgxDragAndDropListDataDirective,
    NgxDragDropContentOutletDirective
  ],
  imports: [CommonModule, DragDropModule],
  exports: [
    DragDropModule,
    NgxDragdropGridComponent,
    NgxDragAndDropListDataDirective,
    NgxDragDropContentOutletDirective
  ],
  providers: [NgxDragdropGridPresenter],
})
export class NgxDragdropGridModule {
}
