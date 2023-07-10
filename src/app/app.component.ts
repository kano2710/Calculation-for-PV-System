import { Component } from '@angular/core';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  constructor(private locationStrategy: LocationStrategy) {
    // Prevents back button from caching the previous pages
    history.pushState(null, '', window.location.href);  
    this.locationStrategy.onPopState(() => {
      history.pushState(null, '', window.location.href);
    });
  }
}
