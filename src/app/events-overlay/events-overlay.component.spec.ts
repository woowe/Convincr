import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsOverlayComponent } from './events-overlay.component';

describe('EventsOverlayComponent', () => {
  let component: EventsOverlayComponent;
  let fixture: ComponentFixture<EventsOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
