import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CdkDragMove, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NgxDragdropGridPresenter } from './dragdrop-grid.presenter';
import { NgxDragAndDropListDirective } from './drag-and-drop-list.directive';
import { NgxDragAndDropContentOutletDirective } from './drag-and-drop-content-outlet.directive';


@Component({
  selector: 'ngx-dragdrop-grid',
  templateUrl: './dragdrop-grid.component.html',
  styleUrls: ['./dragdrop-grid.component.scss'],
})
export class NgxDragdropGridComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @ViewChildren(NgxDragAndDropContentOutletDirective) contentOutlet: QueryList<NgxDragAndDropContentOutletDirective>;
  @ContentChildren(NgxDragAndDropListDirective) dragAndDropListData: QueryList<NgxDragAndDropListDirective>;

  @ViewChild(CdkDropListGroup, {static: true}) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList, {static: true}) placeholder: CdkDropList;

  @Input() delay: number;
  @Input() draggable = true;

  @Input()
  set items(items: any[]) {
    this.dragDropPresenter.setItems(items);
  }

  get items() {
    return this.dragDropPresenter.items;
  }

  @Output() sorting = new EventEmitter<any[]>();

  private destroyed = new Subject();

  dropListEnterPredicate = this.dragDropPresenter.dropListEnterPredicate;

  // used by *ngFor for better rendering
  dataTrackByFn = (index: number, entity: Partial<any>) => entity?._id || entity?.id || index;

  constructor(
    private cdr: ChangeDetectorRef,
    private dragDropPresenter: NgxDragdropGridPresenter,
  ) {
  }

  ngOnInit(): void {
    this.dragDropPresenter.reorderChanges.pipe(takeUntil(this.destroyed)).subscribe((data) => {
      this.sorting.emit(data);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.renderItems();
  }

  ngAfterViewInit() {
    this.renderItems();
    this.dragDropPresenter.afterViewInit(this.listGroup, this.placeholder);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  public renderItems() {
    if (!this.contentOutlet) {
      return;
    }

    this.cdr.detectChanges();

    this.contentOutlet.toArray().forEach((outlet: NgxDragAndDropContentOutletDirective, index: number) => {
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
