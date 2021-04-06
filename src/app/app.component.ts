import { Component } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  items = new BehaviorSubject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

  dataTrackByFn = (index, item) => item;

  constructor() {
  }

  sorting(data) {
    this.items.next(data);
    console.log(data);
  }

}
