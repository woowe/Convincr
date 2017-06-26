import { Component, Input, ViewChild, ElementRef, HostBinding, ViewEncapsulation, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs';

import * as GoogleMapsLoader from 'google-maps';

import { AppState } from '../interfaces';
import { environment } from '../../environments/environment';

@Component({
  selector: 'convincr-events-overlay',
  templateUrl: './events-overlay.component.html',
  styleUrls: ['./events-overlay.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventsOverlayComponent implements OnInit, OnDestroy {
  @HostBinding('class.convincr-events-overlay') _convincr_events_overlay_class = true;

  places$: Observable<any>;
  places_destroy$ = new Subject();

  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
    this.places$ = this.store$
      .filter((store) => store.places.length > 0)
      .takeUntil(this.places_destroy$);
  }

  ngOnDestroy() {
    this.places_destroy$.next(true);
  }

}
