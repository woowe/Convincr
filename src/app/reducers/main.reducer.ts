import { Action } from '@ngrx/store';

import { AppState } from '../interfaces/';

export const INITIAL_STATE: AppState = {
  places: []
};

export function mainReducer(state: AppState = INITIAL_STATE, action: Action): any {
  switch(action.type) {
    case 'SET_PLACES':
      return Object.assign({}, state, { places: action.payload })
    default:
      return state;
  }
}
