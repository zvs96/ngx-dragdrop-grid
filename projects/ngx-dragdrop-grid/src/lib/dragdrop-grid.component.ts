import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { CdkDragMove, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { NgxDragdropGridPresenter } from './dragdrop-grid.presenter';

@Directive({selector: '[ngxDragAndDropListData]'})
export class NgxDragAndDropListDataDirective {
  constructor(public template: TemplateRef<any>) {
  }
}

@Directive({selector: '[ngxDragDropContentOutlet]'})
export class NgxDragDropContentOutletDirective {
  constructor(public viewContainer: ViewContainerRef) {
  }
}

@Component({
  selector: 'ngx-dragdrop-grid',
  templateUrl: './dragdrop-grid.component.html',
  styleUrls: ['./dragdrop-grid.component.scss'],
})
export class NgxDragdropGridComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChildren(NgxDragDropContentOutletDirective) contentOutlet: QueryList<NgxDragDropContentOutletDirective>;
  @ContentChildren(NgxDragAndDropListDataDirective) dragAndDropListData: QueryList<NgxDragAndDropListDataDirective>;

  @ViewChild(CdkDropListGroup, {static: true}) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList, {static: true}) placeholder: CdkDropList;

  @Input() aspectRatio = 1;
  @Input() draggable: boolean;
  @Input() items = [1, 2];

  dropListEnterPredicate = this.dragDropPresenter.dropListEnterPredicate;

  constructor(
    private cdr: ChangeDetectorRef,
    private dragDropPresenter: NgxDragdropGridPresenter,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.renderItems();
  }

  ngAfterViewInit() {
    this.renderItems();
    this.dragDropPresenter.afterViewInit(this.listGroup, this.placeholder);
  }

  public renderItems() {
    if (!this.contentOutlet) {
      return;
    }

    this.cdr.detectChanges();

    this.contentOutlet.toArray().forEach((outlet: NgxDragDropContentOutletDirective, index: number) => {
      outlet.viewContainer.clear();
      outlet.viewContainer.createEmbeddedView(
        this.dragAndDropListData.first.template, {
          $implicit: this.items[index],
          index
        });
    });
    this.cdr.detectChanges();
  }

  dropListDropped() {
    this.dragDropPresenter.dropListDropped();
  }

  dragMoved(event: CdkDragMove) {
    this.dragDropPresenter.dragMoved(event);
  }

}
