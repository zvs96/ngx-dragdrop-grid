import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngxDragAndDropList]'
})
export class NgxDragAndDropListDirective {
  constructor(public template: TemplateRef<any>) {
  }
}
