import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MdToolbarModule } from '@angular/material';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { EventsOverlayComponent } from './events-overlay/events-overlay.component';

import { mainReducer } from './reducers/';
import { AppEffects } from './effects';

@NgModule({
  declarations: [
    AppComponent,
    GoogleMapComponent,
    EventsOverlayComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    StoreModule.provideStore(mainReducer),
    EffectsModule.run(AppEffects),
    MdToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
