import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { GeocodingProvider } from '../geocoding/geocoding';

export interface BeerSpot {
  id: number,
  name: string,
  status: string,
  reviewlink: string,
  proxylink: string,
  blogmap: string,
  street: string,
  city: string,
  state: string,
  zip: string,
  country: string,
  phone: string,
  url: string,
  overall: string,
  imagecount: string,
  location: {
    latitude: number,
    longitude: number
  }
}

interface BreweryLocation {
  altmap: string,
  lat: string,
  lng: string,
  map: string,
  name: string,
  status: string
}

@Injectable()
export class BreweryMappingProvider {

  private baseUrl: string = 'http://beermapping.com/webservice';
  private apiKey: string = '5b77e963c25ac961737246e98c014a4e';

  constructor(private http: HttpClient, private geolocation: Geolocation, private geocodingProvider: GeocodingProvider) { }

  getBreweriesInState(state: string): Observable<Array<BeerSpot>> {
    let url: string = this.baseUrl + '/locstate/' + this.apiKey + '/' + state + '&s=json';

    return this.http.get<Array<BeerSpot>>(url).pipe(
      map(spots => spots.filter(spot => spot.status === 'Brewery'))
    );
  }

  addBreweryLocation(brewery: BeerSpot) {
    let url: string = this.baseUrl + '/locmap/' + this.apiKey + '/' + brewery.id + '&s=json';

    this.http.get<Array<BreweryLocation>>(url).subscribe((breweryLocation) => {
      if (breweryLocation[0].name) {
        brewery.location = {
          latitude: parseFloat(breweryLocation[0].lat),
          longitude: parseFloat(breweryLocation[0].lng)
        }
      }
      else {
        let address: string = brewery.street + ' ' + brewery.city + ', ' + brewery.state;
        this.geocodingProvider.forwardGeocode(address).then((location) => {
          brewery.location = {
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude)
          }
        });
      }
    });
  }

}
