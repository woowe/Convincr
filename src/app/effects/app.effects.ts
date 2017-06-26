import { Injectable } from '@angular/core';

import { Effect, Actions, toPayload } from '@ngrx/effects';

import { Observable } from 'rxjs';

@Injectable()
export class AppEffects {

  constructor( private action$: Actions ) {}

  @Effect() loadGooglePlaces = this.action$
    .ofType('LOAD_GOOGLE_PLACES')
    .map(toPayload)
    .switchMap( payload => {
      return Observable.of({});
    });
}
