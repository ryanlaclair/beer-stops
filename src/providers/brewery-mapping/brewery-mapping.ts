import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage} from '@ionic/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeocodingProvider } from '../geocoding/geocoding';
import { GoogleMapsProvider } from '../google-maps/google-maps';

// the BeerSpot object returned by the Beer Mapping API, extended to include
// location and distance
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
  },
  distance: number
}

// the location object returned by the Beer Mapping API
interface BreweryLocation {
  altmap: string,
  lat: string,
  lng: string,
  map: string,
  name: string,
  status: string
}

// the location data object used to cache info to storage
interface LocationData {
  name: string,
  data: Array<BeerSpot>,
  expires: number
}

@Injectable()
export class BreweryMappingProvider {

  private baseUrl: string = 'http://beermapping.com/webservice';
  private apiKey: string = '5b77e963c25ac961737246e98c014a4e';

  constructor(private http: HttpClient, 
    private storage: Storage, 
    private mapsProvider: GoogleMapsProvider, 
    private geocodingProvider: GeocodingProvider) { }

  // get the list of breweries in the specified city
  getBreweriesInCity(city: string): Observable<BeerSpot> {
    return new Observable<BeerSpot>((observer) => {

      this.checkStorage(city).then((breweries: Array<BeerSpot>) => {
        breweries.forEach((brewery: BeerSpot) => {
          observer.next(brewery);
        });
      }).catch(() => {
        let url: string = this.baseUrl + '/loccity/' + this.apiKey + '/' + city + '&s=json';

        this.http.get<Array<BeerSpot>>(url).pipe(
          map(spots => spots.filter(spot => spot.status === 'Brewery'))
        ).subscribe((breweries: Array<BeerSpot>) => {
          breweries.forEach((brewery: BeerSpot, index: number) => {
            setTimeout(() => {
              this.addBreweryLocation(brewery).then((brewery: BeerSpot) => {
                this.addBreweryDistance(brewery).then((brewery: BeerSpot) => {
                  observer.next(brewery);

                  if (index == breweries.length-1) {
                    this.addStorage(city, breweries);
                  }
                });
              });
            }, index*500);
          });
        });
      });
    });
  }

  getBreweriesInState(state: string): Observable<BeerSpot> {
    return new Observable<BeerSpot>((observer) => {
      this.checkStorage(state).then((breweries: Array<BeerSpot>) => {
        breweries.forEach((brewery: BeerSpot) => {
          observer.next(brewery);
        });
      }).catch(() => {
        let url: string = this.baseUrl + '/locstate/' + this.apiKey + '/' + state + '&s=json';

        this.http.get<Array<BeerSpot>>(url).pipe(
          map(spots => spots.filter(spot => spot.status === 'Brewery'))
        ).subscribe((breweries: Array<BeerSpot>) => {
          breweries.forEach((brewery: BeerSpot, index: number) => {
            setTimeout(() => {
              this.addBreweryLocation(brewery).then((brewery: BeerSpot) => {
                this.addBreweryDistance(brewery).then((brewery: BeerSpot) => {
                  observer.next(brewery);

                  if (index == breweries.length-1) {
                    this.addStorage(state, breweries);
                  }
                });
              });
            }, index*500);
          });
        });
      });
    });
  }

  private checkStorage(locationName: string): Promise<Array<BeerSpot>> {
    return new Promise((resolve, reject) => {
      this.storage.get(locationName).then((locationData: LocationData) => {
        if (locationData) {
          if (locationData.name == locationName && locationData.expires > Date.now()) {
            resolve(locationData.data);
          }
        }
        else {
          reject(null);
        }
      });
    });    
  }

  private addStorage(locationName: string, data: Array<BeerSpot>) {
    let date = new Date();
    date.setDate(date.getDate() + 7);

    let locationData: LocationData = {
      name: locationName,
      data: data,
      expires: date.getTime()
    }

    this.storage.set(locationName, locationData);
  }

  private addBreweryLocation(brewery: BeerSpot): Promise<BeerSpot> {
    return new Promise((resolve) => {
      let url: string = this.baseUrl + '/locmap/' + this.apiKey + '/' + brewery.id + '&s=json';

      this.http.get<Array<BreweryLocation>>(url).subscribe((breweryLocation) => {
        if (breweryLocation[0].name) {
          brewery.location = {
            latitude: parseFloat(breweryLocation[0].lat),
            longitude: parseFloat(breweryLocation[0].lng),
          }

          resolve(brewery);
        }
        else {
          let address: string = brewery.street + ' ' + brewery.city + ', ' + brewery.state;
          this.geocodingProvider.forwardGeocode(address).then((location) => {
            brewery.location = {
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude)
            }

            resolve(brewery);
          });
        }
      });
    });
  }

  private addBreweryDistance(brewery: BeerSpot): Promise<BeerSpot> {
    return new Promise((resolve) => {
      let position = this.mapsProvider.getUserPosition();

      let startLatLng = new google.maps.LatLng(position.latitude, position.longitude);
      let endLatLng = new google.maps.LatLng(brewery.location.latitude, brewery.location.longitude);

      brewery.distance = google.maps.geometry.spherical.computeDistanceBetween(startLatLng, endLatLng);
      
      resolve(brewery);
    });
  }

}
