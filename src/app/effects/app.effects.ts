import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';

import { Observable } from 'rxjs';

import * as GoogleMapsLoader from 'google-maps';

import { AppState } from '../interfaces';

@Injectable()
export class AppEffects {

  @Effect() loadGoogleApis$ = this.action$
    .ofType('LOAD_GOOGLE_APIS')
    .map(toPayload)
    .switchMap( payload => {
      if (payload.key) {
        GoogleMapsLoader.KEY = payload.key;
      }

      if (payload.libraries) {
        GoogleMapsLoader.LIBRARIES = payload.libraries;
      }

      return Observable.create((observer) => {
        GoogleMapsLoader.load((google) => {
          observer.next({type: 'GOOGLE_APIS_LOADED', payload: google});
          observer.complete();
        });
      });
    });

  @Effect() getClientPosition$ = this.action$
    .ofType('WATCH_CLIENT_POSITION')
    .map(toPayload)
    .switchMap( payload => {
      if ('geolocation' in navigator) {
        return Observable.create((observer) => {
          const watch_id = navigator.geolocation.watchPosition((position) => {
            observer.next({type: 'UPDATE_GEOLOCATION', payload: position});
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
    .ofType('UPDATE_GEOLOCATION')
    .map(toPayload)
    // .switchMap( payload => this.store$, (payload, store) => ({payload, store}))
    .switchMap( payload => {
      return Observable.of({ type: 'ADD_PLACE' });
    });

  constructor( private action$: Actions, private store$: Store<AppState> ) {}
}
