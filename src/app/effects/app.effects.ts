import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';

import { Observable, Subject } from 'rxjs';

import * as GoogleMapsLoader from 'google-maps';

import { AppState } from '../interfaces';
import { is_defined, dist_lat_lng } from '../utils';

@Injectable()
export class AppEffects {

  @Effect() loadGoogleApis$ = this.action$
    .ofType('LOAD_GOOGLE_APIS')
    .first()
    .map(toPayload)
    .switchMap( payload => {
      if (payload.key) {
        GoogleMapsLoader.KEY = payload.key;
      }

      if (payload.libraries) {
        GoogleMapsLoader.LIBRARIES = payload.libraries;
      }

      let ret_stream = new Subject();

      GoogleMapsLoader.load((google) => {
        ret_stream.next({type: 'GOOGLE_APIS_LOADED', payload: google});
        ret_stream.unsubscribe();
      });

      return ret_stream;
    });

  @Effect() getClientPosition$ = this.action$
    .ofType('WATCH_CLIENT_POSITION')
    .map(toPayload)
    .switchMap( payload => {
      if ('geolocation' in navigator) {
        return Observable.create((observer) => {
          const watch_id = navigator.geolocation.watchPosition((position) => {
            observer.next({type: 'UPDATE_GEOLOCATION', payload: {lat: position.coords.latitude, lng: position.coords.longitude}});
          }, (error) => {
            observer.error();
            navigator.geolocation.clearWatch(watch_id);
            observer.complete();
          });
        });
      } else {
        return Observable.of({type: 'GEOLOCATION_NOT_ENABLED'});
      }
    });

  @Effect() getPlacesNearby$ = this.action$
    .ofType('UPDATE_NEARBY_PLACES')
    .map(toPayload)
    .switchMap( payload => this.store$, (payload, store) => ({payload, store}))
    .filter(({payload, store}) => is_defined(store.google, store.geolocation, store.map))
    .map(({payload, store}) => ({payload, google: store.google, geolocation: store.geolocation, map: store.map}))
    .distinctUntilKeyChanged('geolocation', (x: any, y: any) => (dist_lat_lng(x, y) < 50))
    .switchMap( ({payload, google, geolocation, map}) => {
      const loc = new google.maps.LatLng(geolocation.lat, geolocation.lng);

      const places_service = new google.maps.places.PlacesService(map);

      const search_opts = Object.assign({}, {
        location: loc,
        radius: 500,
      }, payload);

      return Observable.create((observer) => {
        places_service.nearbySearch(search_opts, (res, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            observer.next({ type: 'SET_PLACES', payload: res});
          }
        });
      });
    });

  constructor( private action$: Actions, private store$: Store<AppState> ) {}
}
