import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngxDragDropContentOutlet]'
})
export class NgxDragAndDropContentOutletDirective {
  constructor(public viewContainer: ViewContainerRef) {
  }
}
