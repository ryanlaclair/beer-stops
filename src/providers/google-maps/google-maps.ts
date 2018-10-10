import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class GoogleMapsProvider {

  mapElement: any;
  map: any;
  geocoder: any;
  userMarker: any;

  breweryMarkers: Array<any>;

  constructor(private geolocation: Geolocation) { }

  initializeMap(mapElement: any): Promise<any> {
    this.mapElement = mapElement;

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

  addMarker(address: string) {
    return new Promise((resolve) => {
      if (this.geocoder == null) {
        this.geocoder = new google.maps.Geocoder();
      }

      this.geocoder.geocode({ address: address }, (results, status) => {
        console.log(status);

        if (status === 'OK') {
          let latLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lon());

          let markerOptions = {
            position: latLng,
            map: this.map,
            clickable: false
          }

          this.breweryMarkers.push(new google.maps.Marker(markerOptions));
          resolve(true);
        }
      });
    });
  }

}
