import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren, EmbeddedViewRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TrackByFunction,
  ViewChild,
  ViewChildren, ViewRef,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgxDragdropGridPresenter]
})
export class NgxDragdropGridComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @ViewChildren(NgxDragAndDropContentOutletDirective) contentOutlet: QueryList<NgxDragAndDropContentOutletDirective>;
  @ContentChildren(NgxDragAndDropListDirective) dragAndDropListData: QueryList<NgxDragAndDropListDirective>;

  @ViewChild(CdkDropListGroup, {static: true}) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList, {static: true}) placeholder: CdkDropList;

  @Input() delay = 0;
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

  @Input() trackBy: TrackByFunction<any> = (index: number, item: any) => index;

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
    if (changes.items && JSON.stringify(changes.items.previousValue) === JSON.stringify(changes.items.currentValue)) {
      this.renderItems();
    }
  }

  ngAfterViewInit() {
    this.dragDropPresenter.afterViewInit(this.listGroup, this.placeholder);
    this.renderItems();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  public renderItems() {
    if (!this.contentOutlet) {
      return;
    }

    this.contentOutlet.toArray().map((outlet: NgxDragAndDropContentOutletDirective, index: number) => {
      const view: EmbeddedViewRef<any> = outlet.viewContainer.createEmbeddedView(this.dragAndDropListData.first.template,
        {
          $implicit: this.items[index],
          index
        }
      );

      console.log(outlet.viewContainer.indexOf(view))
      console.log(outlet.viewContainer)

      return view;
    });

  }

  dropListDropped() {
    this.dragDropPresenter.dropListDropped();
  }

  dragMoved(event: CdkDragMove) {
    this.dragDropPresenter.dragMoved(event);
  }

}
