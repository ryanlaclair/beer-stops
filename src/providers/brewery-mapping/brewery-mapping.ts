import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators'

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
  imagecount: string
}

@Injectable()
export class BreweryMappingProvider {

  // http://beermapping.com/webservice/locstate/API_KEY/co
  private baseUrl: string = 'http://beermapping.com/webservice';
  private apiKey: string = '5b77e963c25ac961737246e98c014a4e';

  constructor(private http: HttpClient, private geolocation: Geolocation) { }

  getBreweriesInState(state: string): Observable<Array<BeerSpot>> {
    let url: string = this.baseUrl + '/locstate/' + this.apiKey + '/' + state + '&s=json';

    return this.http.get<Array<BeerSpot>>(url).pipe(
      map(spots => spots.filter(spot => spot.status === 'Brewery'))
    );
  }


}
