import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

@Injectable()
export class GoogleMapsProvider {

  map: google.maps.Map;
  userPosition: Geoposition;

  markers: Array<google.maps.Marker> = new Array();

  constructor(private geolocation: Geolocation) { }

  initializeMap(mapElement: any) {
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

      this.map = new google.maps.Map(mapElement, mapOptions);

      let markerOptions = {
        position: latLng,
        map: this.map,
        clickable: false,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 5,
          strokeColor: 'blue'
        }
      }

      new google.maps.Marker(markerOptions);
    });
  }

  addMarker(latitude: number, longitude: number, id: number, clickHandler: Function) {
    let latLng = new google.maps.LatLng(latitude, longitude);

    let markerOptions = {
      position: latLng,
      map: this.map,
      clickable: true,
      id: id
    }

    let marker = new google.maps.Marker(markerOptions);
    this.markers.push(marker);

    google.maps.event.addListener(marker, 'click', () => {
      clickHandler(marker.get('id'));
      this.bounceMarker(marker);
    });
  }

  showMarker(id: number) {
    let marker: google.maps.Marker = this.markers.find((marker: google.maps.Marker) => {
      return marker.get('id') == id;
    });

    let bounds = new google.maps.LatLngBounds();
    let userLatLng = new google.maps.LatLng(this.getUserPosition().latitude, this.getUserPosition().longitude);

    bounds.extend(userLatLng);
    bounds.extend(marker.getPosition());

    this.map.fitBounds(bounds, 100);

    this.bounceMarker(marker);
  }

  getUserPosition(): Geoposition['coords'] {
    return this.userPosition.coords;
  }

  private bounceMarker(marker: google.maps.Marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);

    setTimeout(() => {
      marker.setAnimation(null);
    }, 1400);
  }

}