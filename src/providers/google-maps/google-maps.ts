import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

@Injectable()
export class GoogleMapsProvider {
  mapElement: any;

  map: google.maps.Map;
  userPosition: Geoposition;

  markers: Array<google.maps.Marker>;

  constructor(private geolocation: Geolocation) {}

  // initialize the map element
  initializeMap(mapElement: any) {
    this.mapElement = mapElement;

    this.drawMap();
  }

  // draw the map using the Google maps API
  drawMap() {
    this.markers = new Array();

    this.geolocation.getCurrentPosition().then(position => {
      this.userPosition = position;

      let latLng = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false
      };

      this.map = new google.maps.Map(this.mapElement, mapOptions);

      let markerOptions = {
        position: latLng,
        map: this.map,
        clickable: false,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 5,
          strokeColor: 'blue'
        },
        zIndex: 999
      };

      new google.maps.Marker(markerOptions);
    });
  }

  // add a marker to the map
  addMarker(
    latitude: number,
    longitude: number,
    id: number,
    clickHandler: Function
  ) {
    let latLng = new google.maps.LatLng(latitude, longitude);

    let markerOptions = {
      position: latLng,
      map: this.map,
      clickable: true,
      id: id
    };

    let marker = new google.maps.Marker(markerOptions);
    this.markers.push(marker);

    google.maps.event.addListener(marker, 'click', () => {
      clickHandler(marker.get('id'));
      this.bounceMarker(marker);
    });
  }

  // zoom and pan the map to show the current marker
  showMarker(id: number) {
    let marker: google.maps.Marker = this.markers.find(
      (marker: google.maps.Marker) => {
        return marker.get('id') == id;
      }
    );

    let bounds = new google.maps.LatLngBounds();
    let userLatLng = new google.maps.LatLng(
      this.getUserPosition().latitude,
      this.getUserPosition().longitude
    );

    bounds.extend(userLatLng);
    bounds.extend(marker.getPosition());

    this.map.fitBounds(bounds, 100);

    this.bounceMarker(marker);
  }

  // get the user position and return the coordinates
  getUserPosition(): Geoposition['coords'] {
    return this.userPosition.coords;
  }

  // bounce a marker on the map for 2 cycles
  private bounceMarker(marker: google.maps.Marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);

    setTimeout(() => {
      marker.setAnimation(null);
    }, 1400);
  }
}
