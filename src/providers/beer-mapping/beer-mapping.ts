import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs';

@Injectable()
export class BeerMappingProvider {

  // http://beermapping.com/webservice/locstate/API_KEY/co
  private baseUrl: string = 'http://beermapping.com/webservice';
  private apiKey: string = '5b77e963c25ac961737246e98c014a4e';

  constructor(private http: HttpClient, private geolocation: Geolocation) { }

  getBreweriesInState(state: string): Observable<any> {
    return;
  }

}
