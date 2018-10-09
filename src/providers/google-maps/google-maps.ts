import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class GoogleMapsProvider {

  mapElement: any;
  map: any;
  currentMarker: any;
  
  apiKey: string = 'AIzaSyCIx0MKgQnr03E1koIG5ojQAUivrlY34LM';

  constructor(private geolocation: Geolocation) { }

  loadMap(mapElement: any): Promise<any> {
    this.mapElement = mapElement;

    return new Promise((resolve) => {
      window['initializeMap'] = () => {
        this.initializeMap().then(() => {
          resolve(true);
        });
      }

      let script = document.createElement("script");
      script.id = "googleMaps";
      script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=initializeMap';

      document.body.appendChild(script);
    });
  }

  initializeMap(): Promise<any> {
    return new Promise((resolve) => {
      this.geolocation.getCurrentPosition().then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false
        }

        this.map = new google.maps.Map(this.mapElement, mapOptions);

        let markerOptions = {
          position: latLng,
          map: this.map,
          clickable: false
        }

        this.currentMarker = new google.maps.Marker(markerOptions);

        resolve(true);
      });
    });
  }

  addMarker() {
  }

}
