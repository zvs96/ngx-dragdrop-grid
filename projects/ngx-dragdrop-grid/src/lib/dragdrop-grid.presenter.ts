import { Injectable } from '@angular/core';
import { CdkDrag, CdkDragMove, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { ViewportRuler } from '@angular/cdk/overlay';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class NgxDragdropGridPresenter {

  items: any[];
  reorderChanges = new ReplaySubject<any[]>(1);

  listGroup: CdkDropListGroup<CdkDropList>;
  placeholder: CdkDropList;

  public target: CdkDropList;
  public source: CdkDropList;
  public targetIndex: number;
  public sourceIndex: number;
  public activeContainer: CdkDropList<HTMLElement>;

  constructor(
    private viewportRuler: ViewportRuler,
  ) {
    this.target = null;
    this.source = null;
  }

  afterViewInit(listGroup: CdkDropListGroup<CdkDropList>, placeholder: CdkDropList) {
    if (!placeholder?.element?.nativeElement) {
      return;
    }

    this.listGroup = listGroup;
    this.placeholder = placeholder;
    const phElement = this.placeholder.element.nativeElement;
    phElement.style.display = 'none';
    phElement.parentElement.removeChild(phElement);
  }

  setItems<T = any>(items: T[]): T[] {
    return this.items = items;
  }

  dragMoved(e: CdkDragMove): void {
    const point = this.getPointerPositionOnPage(e.event);

    this.listGroup._items.forEach(dropList => {
      if (this._isInsideDropListClientRect(dropList, point.x, point.y)) {
        this.activeContainer = dropList;
        return;
      }
    });
  }

  dropListDropped(): void {
    if (!this.target) {
      return;
    }

    const phElement = this.placeholder.element.nativeElement;
    const parent = phElement.parentElement;

    phElement.style.display = 'none';

    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

    this.target = null;
    this.source = null;

    if (this.sourceIndex !== this.targetIndex) {
      moveItemInArray(this.items, this.sourceIndex, this.targetIndex);
      this.reorderChanges.next(this.items);
    }
  }

  dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {

    if (drop === this.placeholder) {
      return true;
    }

    if (drop !== this.activeContainer) {
      return false;
    }

    const phElement = this.placeholder.element.nativeElement;
    const sourceElement = drag.dropContainer.element.nativeElement;
    const dropElement = drop.element.nativeElement;

    const dragIndex = this._indexOf(dropElement.parentElement.children, (this.source ? phElement : sourceElement));
    const dropIndex = this._indexOf(dropElement.parentElement.children, dropElement);

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = sourceElement.clientWidth + 'px';
      phElement.style.height = sourceElement.clientHeight + 'px';

      sourceElement.parentElement.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;


    phElement.style.display = '';
    dropElement.parentElement.insertBefore(phElement, (dropIndex > dragIndex
      ? dropElement.nextSibling : dropElement));

    this.source._dropListRef.start();
    this.placeholder._dropListRef.enter(drag._dragRef, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);
    this.source._dropListRef.exit(drag._dragRef);

    return false;
  }

  /** Determines the point of the page that was touched by the user. */
  getPointerPositionOnPage(event: MouseEvent | TouchEvent): { x: number, y: number } {
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    const point = this._isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
    const scrollPosition = this.viewportRuler.getViewportScrollPosition();

    return {
      x: point.pageX - scrollPosition.left,
      y: point.pageY - scrollPosition.top
    };
  }

  _indexOf(collection, node): number {
    return Array.prototype.indexOf.call(collection, node);
  }

  /** Determines whether an event is a touch event. */
  _isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
    return event.type.startsWith('touch');
  }

  _isInsideDropListClientRect(dropList: CdkDropList, x: number, y: number): boolean {
    const {top, bottom, left, right} = dropList.element.nativeElement.getBoundingClientRect();
    return y >= top && y <= bottom && x >= left && x <= right;
  }

}
