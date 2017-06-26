import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs';

import * as GoogleMapsLoader from 'google-maps';

import { AppState } from '../interfaces';
import { is_defined } from '../utils';
import { environment } from '../../environments/environment';

@Component({
  selector: 'convincr-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding('class.convincr-google-maps') _convincr_google_maps_class = true;

  @ViewChild('googleMaps')
  _google_maps: ElementRef;

  @Input() zoom = 15;

  google$: Observable<any>;
  geolocation$: Observable<any>;

  google_destroy$ = new Subject();
  geolocation_destroy$ = new Subject();

  constructor(private store$: Store<AppState>) {}

  ngOnInit() {
    this.store$.dispatch({type: 'LOAD_GOOGLE_APIS', payload: {
        key: environment.google_api_key,
        libraries: environment.google_libraries
      }
    });

    this.store$.dispatch({type: 'WATCH_CLIENT_POSITION' });

    this.geolocation$ = this.store$
      .filter((store) => is_defined(store.geolocation) )
      .map(store => store.geolocation)
      .takeUntil(this.geolocation_destroy$);

    this.google$ = this.store$
      .filter((store) => is_defined(store.google) )
      .map(store => store.google)
      .takeUntil(this.google_destroy$);
  }

  ngAfterViewInit() {
    let uluru, map, marker;
    this.google$.first()
      .switchMap((google) => this.geolocation$.first(), (google, geolocation) => ({google, geolocation}))
      .subscribe(({google, geolocation}) => {
        uluru = geolocation;
        map = new google.maps.Map(this._google_maps.nativeElement, {
          zoom: this.zoom,
          center: uluru
        });

        this.store$.dispatch({type: 'SET_MAP', payload: map});

        marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
      });

    this.geolocation$.skip(1).takeUntil(this.geolocation_destroy$).subscribe((geolocation) => {
      uluru = geolocation;
    });
  }

  ngOnDestroy() {
    this.geolocation_destroy$.next(true);
    this.google_destroy$.next(true);
  }

}
