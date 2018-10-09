import { Component, ViewChild, ElementRef } from '@angular/core';

import { GoogleMapsProvider } from '../../providers/google-maps/google-maps'

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})

export class MapComponent {

  @ViewChild('map') mapElement: ElementRef;

  apiKey: string = 'AIzaSyCIx0MKgQnr03E1koIG5ojQAUivrlY34LM';

  constructor(private mapsProvider: GoogleMapsProvider) { }

  ngOnInit(): void {
    this.mapsProvider.loadMap(this.mapElement.nativeElement);
  }

}