import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class GoogleMapsProvider {

  mapElement: any;
  map: any;
  userPosition: any;
  userMarker: any;

  breweryMarkers: Array<any> = new Array();

  constructor(private geolocation: Geolocation) { }

  initializeMap(mapElement: any): Promise<any> {
    this.mapElement = mapElement;

    return new Promise((resolve) => {
      this.geolocation.getCurrentPosition().then((position) => {
        this.userPosition = position;

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
          clickable: false,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5,
            strokeColor: 'red'
          }
        }

        this.userMarker = new google.maps.Marker(markerOptions);

        resolve(true);
      });
    });
  }

  addMarker(latitude: number, longitude: number): Promise<any> {
    return new Promise((resolve) => {
      let latLng = new google.maps.LatLng(latitude, longitude);

      let markerOptions = {
        position: latLng,
        map: this.map,
        clickable: false
      }

      this.breweryMarkers.push(new google.maps.Marker(markerOptions));
      resolve(true);
    });
  }

  getUserPosition() {
    return this.userPosition;
  }

}