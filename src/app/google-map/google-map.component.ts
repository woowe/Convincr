import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '../interfaces';

@Component({
  selector: 'convincr-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {

  constructor(private store$: Store<AppState>) {

  }

  ngOnInit() {
    this.store$.dispatch({type: 'LOAD_GOOGLE_PLACES', payload: {
      lat: 0,
      lng: 0
    }});
  }

}
