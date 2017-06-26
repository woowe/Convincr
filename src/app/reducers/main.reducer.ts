import { Action } from '@ngrx/store';

import { AppState } from '../interfaces/';

export const INITIAL_STATE: AppState = {
  places: [],
  geolocation: null,
  google: null,
  map: null
};

export function mainReducer(state: AppState = INITIAL_STATE, action: Action): any {
  switch(action.type) {
    case 'SET_PLACES':
      return Object.assign({}, state, { places: action.payload });
    case 'SET_MAP':
      return Object.assign({}, state, { map: action.payload });
    case 'UPDATE_GEOLOCATION':
      return Object.assign({}, state, { geolocation: action.payload });
    case 'GOOGLE_APIS_LOADED':
      return Object.assign({}, state, { google: action.payload });
    default:
      return state;
  }
}
