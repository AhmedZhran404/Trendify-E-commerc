import { FlowbiteService } from './core/services/flowbite/flowbite.service';
import { Component, NgZone } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'trendifyE-commerce';

  constructor(  private ngZone: NgZone , private FlowbiteService: FlowbiteService , private router: Router, private viewportScroller: ViewportScroller) {
    if (typeof window !== 'undefined') {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 300);
          });
        }
      });
    }
  }

  ngOnInit(): void {
    this.FlowbiteService.loadFlowbite(flowbite => {
    });
  }

}
