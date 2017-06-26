import { Component, Input, ViewChild, ElementRef, HostBinding, ViewEncapsulation, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs';

import * as GoogleMapsLoader from 'google-maps';

import { AppState } from '../interfaces';
import { environment } from '../../environments/environment';

@Component({
  selector: 'convincr-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GoogleMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding('class.convincr-google-maps') _convincr_google_maps_class = true;

  @ViewChild('googleMaps')
  _google_maps: ElementRef;

  @Input() zoom = 15;

  _geolocation: Observable<AppState>;
  _geolocation_destroy = new Subject();

  constructor(private store$: Store<AppState>) {}

  ngOnInit() {
    this.store$.dispatch({type: 'WATCH_CLIENT_POSITION' });

    this._geolocation = this.store$
      .filter((store) => store.geolocation !== null  && store.geolocation !== undefined);
  }

  ngAfterViewInit() {
    GoogleMapsLoader.KEY = environment.google_api_key;

    let uluru, map, marker;
    GoogleMapsLoader.load((google) => {

      this._geolocation.first().subscribe((store) => {
        uluru = {lat: store.geolocation.coords.latitude, lng: store.geolocation.coords.longitude};
        map = new google.maps.Map(this._google_maps.nativeElement, {
          zoom: this.zoom,
          center: uluru
        });

        marker = new google.maps.Marker({
          position: uluru,
          map: map
        });

      });

      this._geolocation.skip(1).takeUntil(this._geolocation_destroy).subscribe((store) => {
        uluru = {lat: store.geolocation.coords.latitude, lng: store.geolocation.coords.longitude};
      });
    });
  }

  ngOnDestroy() {
    this._geolocation_destroy.next(true);
  }

}
