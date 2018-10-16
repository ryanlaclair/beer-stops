import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';

@Injectable()
export class GoogleMapsProvider {
  mapElement: any = null;

  map: google.maps.Map;

  center: google.maps.LatLng;
  centerMarker: google.maps.Marker;

  markers: Array<google.maps.Marker>;

  constructor(private platform: Platform, private geolocation: Geolocation) {}

  // initialize the map element
  initializeMap(mapElement: any) {
    this.mapElement = mapElement;

    this.addUserLocation().then(() => {
      this.drawMap();
    });
  }

  addUserLocation(): Promise<any> {
    return new Promise(resolve => {
      this.getUserPosition().then(position => {
        this.addCenter(position.latitude, position.longitude);

        resolve(true);
      });
    });
  }

  addCenter(latitude: number, longitude: number) {
    this.center = new google.maps.LatLng(latitude, longitude);
  }

  // draw the map using the Google maps API
  drawMap() {
    this.markers = new Array();

    let mapOptions = {
      center: this.center,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false
    };

    this.map = new google.maps.Map(this.mapElement, mapOptions);

    let markerOptions = {
      position: this.center,
      map: this.map,
      clickable: false,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        strokeColor: 'blue'
      },
      zIndex: 999
    };

    this.centerMarker = new google.maps.Marker(markerOptions);
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

    bounds.extend(this.center);
    bounds.extend(marker.getPosition());

    this.map.fitBounds(bounds, 100);

    this.bounceMarker(marker);
  }

  // get the user position and return the coordinates
  getUserPosition(): Promise<Geoposition['coords']> {
    return new Promise(resolve => {
      this.platform.ready().then(() => {
        this.geolocation
          .getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 10000
          })
          .then(position => {
            resolve(position.coords);
          });
      });
    });
  }

  // bounce a marker on the map for 2 cycles
  private bounceMarker(marker: google.maps.Marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);

    setTimeout(() => {
      marker.setAnimation(null);
    }, 1400);
  }
}
