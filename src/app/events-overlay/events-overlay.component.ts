import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';

import { trigger, transition, stagger, query, style, animate } from '@angular/animations';

import { Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs';

import * as GoogleMapsLoader from 'google-maps';

import { AppState } from '../interfaces';
import { is_defined } from '../utils';
import { environment } from '../../environments/environment';

@Component({
  selector: 'convincr-events-overlay',
  templateUrl: './events-overlay.component.html',
  styleUrls: ['./events-overlay.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('listAnimation', [
      transition('* => in', [
        query('md-list-item', style({ opacity: 0, transform: 'translateX(-50%)' }), { optional: true }),
        query('md-list-item', stagger('50ms', [
          animate('0.2s ease', style({ opacity: 1, transform: 'translateX(0%)' }))
        ]), { optional: true })
      ])
    ])
  ]
})
export class EventsOverlayComponent implements OnInit, OnDestroy {
  @HostBinding('class.convincr-events-overlay') _convincr_events_overlay_class = true;

  places$: Observable<any>;
  places_destroy$ = new Subject();

  google$: Observable<any>;
  google_destroy$ = new Subject();

  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
    this.store$.dispatch({type: 'LOAD_GOOGLE_APIS', payload: {
        key: environment.google_api_key,
        libraries: environment.google_libraries
      }
    });

    this.store$.dispatch({type: 'UPDATE_NEARBY_PLACES'});

    this.places$ = this.store$
      .filter((store) => store.places.length > 0)
      .map(store =>  store.places)
      .takeUntil(this.places_destroy$);

    this.google$ = this.store$
      .filter((store) => is_defined(store.google) )
      .takeUntil(this.google_destroy$);
  }

  ngOnDestroy() {
    this.places_destroy$.next(true);
    this.google_destroy$.next(true);
  }

}
