import { Component, ViewChild, ElementRef } from '@angular/core';

import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})

export class MapComponent {

  @ViewChild('map') mapElement: ElementRef;

  constructor(private mapsProvider: GoogleMapsProvider) { }

  ngOnInit(): void {
    this.mapsProvider.initializeMap(this.mapElement.nativeElement);
  }

}