import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {CdkDragMove, CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';

import {DragDropPresenter} from './drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;

  items: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  dropListEnterPredicate = this.dragDropPresenter.dropListEnterPredicate;

  constructor(
    private dragDropPresenter: DragDropPresenter
  ) {
  }

  ngAfterViewInit(): void {
    this.dragDropPresenter.init(this.listGroup, this.placeholder);

    this.dragDropPresenter.setItems(this.items);

    this.dragDropPresenter.reorderChanges.subscribe(changes => console.log('[Changes] ', changes));
  }

  dropListDropped() {
    this.dragDropPresenter.dropListDropped();
  }

  dragMoved(event: CdkDragMove) {
    this.dragDropPresenter.dragMoved(event);
  }

}
