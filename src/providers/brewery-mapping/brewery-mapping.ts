import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeocodingProvider } from '../geocoding/geocoding';
import { GoogleMapsProvider } from '../google-maps/google-maps';

// the BeerSpot object returned by the Beer Mapping API, extended to include
// location and distance
export interface BeerSpot {
  id: number;
  name: string;
  status: string;
  reviewlink: string;
  proxylink: string;
  blogmap: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  url: string;
  overall: string;
  imagecount: string;
  location: {
    latitude: number;
    longitude: number;
  };
  distance: number;
}

// the location object returned by the Beer Mapping API
interface BreweryLocation {
  altmap: string;
  lat: string;
  lng: string;
  map: string;
  name: string;
  status: string;
}

// the location data object used to cache info to storage
interface LocationData {
  name: string;
  data: Array<BeerSpot>;
  expires: number;
}

@Injectable()
export class BreweryMappingProvider {
  private baseUrl: string = 'http://beermapping.com/webservice';
  private apiKey: string = '5b77e963c25ac961737246e98c014a4e';

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private mapsProvider: GoogleMapsProvider,
    private geocodingProvider: GeocodingProvider
  ) {}

  // get the list of breweries in the specified city
  getBreweriesInCity(city: string): Observable<BeerSpot> {
    return new Observable<BeerSpot>(observer => {
      // first check if the city has been cached in storage
      this.checkStorage(city)
        .then((breweries: Array<BeerSpot>) => {
          breweries.forEach((brewery: BeerSpot, index: number) => {
            // use a timeout to not exceed query limits
            setTimeout(() => {
              this.addBreweryLocation(brewery).then((brewery: BeerSpot) => {
                this.addBreweryDistance(brewery).then((brewery: BeerSpot) => {
                  observer.next(brewery);
                });
              });
            }, index * 500);
          });
        })
        // if it has not been cached, retreive from the Beer Mapping API
        .catch(() => {
          let url: string =
            this.baseUrl + '/loccity/' + this.apiKey + '/' + city + '&s=json';

          // query the Beer Mapping API
          this.http
            .get<Array<BeerSpot>>(url)
            // filter to only breweries
            .pipe(map(spots => spots.filter(spot => spot.status === 'Brewery')))
            .subscribe((breweries: Array<BeerSpot>) => {
              this.addStorage(city, breweries);

              breweries.forEach((brewery: BeerSpot, index: number) => {
                // use a timeout to not exceed query limits
                setTimeout(() => {
                  this.addBreweryLocation(brewery).then((brewery: BeerSpot) => {
                    this.addBreweryDistance(brewery).then(
                      (brewery: BeerSpot) => {
                        observer.next(brewery);
                      }
                    );
                  });
                }, index * 500);
              });
            });
        });
    });
  }

  // get the list of breweries in a specified state
  getBreweriesInState(state: string): Observable<BeerSpot> {
    return new Observable<BeerSpot>(observer => {
      // first check if the city has been cached in storage
      this.checkStorage(state)
        .then((breweries: Array<BeerSpot>) => {
          breweries.forEach((brewery: BeerSpot, index: number) => {
            // use a timeout to not exceed query limits
            setTimeout(() => {
              this.addBreweryLocation(brewery).then((brewery: BeerSpot) => {
                this.addBreweryDistance(brewery).then((brewery: BeerSpot) => {
                  observer.next(brewery);
                });
              });
            }, index * 500);
          });
        })
        // if it has not been cached, retreive from the Beer Mapping API
        .catch(() => {
          let url: string =
            this.baseUrl + '/locstate/' + this.apiKey + '/' + state + '&s=json';

          this.http
            .get<Array<BeerSpot>>(url)
            // filter to only breweries
            .pipe(map(spots => spots.filter(spot => spot.status === 'Brewery')))
            .subscribe((breweries: Array<BeerSpot>) => {
              this.addStorage(state, breweries);

              breweries.forEach((brewery: BeerSpot, index: number) => {
                // use a timeout to not exceed query limits
                setTimeout(() => {
                  this.addBreweryLocation(brewery).then((brewery: BeerSpot) => {
                    this.addBreweryDistance(brewery).then(
                      (brewery: BeerSpot) => {
                        observer.next(brewery);
                      }
                    );
                  });
                }, index * 500);
              });
            });
        });
    });
  }

  // check if location data exists in storage
  private checkStorage(locationName: string): Promise<Array<BeerSpot>> {
    return new Promise((resolve, reject) => {
      this.storage.get(locationName).then((locationData: LocationData) => {
        // if location data exists
        if (locationData) {
          // if location data is correct and not expired
          if (
            locationData.name == locationName &&
            locationData.expires > Date.now()
          ) {
            resolve(locationData.data);
          }
        } else {
          reject(null);
        }
      });
    });
  }

  // add the location data to storage
  private addStorage(locationName: string, data: Array<BeerSpot>) {
    // create an expiration date of 1 week from current time
    let date = new Date();
    date.setDate(date.getDate() + 7);

    let locationData: LocationData = {
      name: locationName,
      data: data,
      expires: date.getTime()
    };

    // add to storage
    this.storage.set(locationName, locationData);
  }

  // add a location to the BeerSpot
  private addBreweryLocation(brewery: BeerSpot): Promise<BeerSpot> {
    return new Promise(resolve => {
      let url: string =
        this.baseUrl + '/locmap/' + this.apiKey + '/' + brewery.id + '&s=json';

      // attempt to get location from the Beer Mapping API
      this.http.get<Array<BreweryLocation>>(url).subscribe(breweryLocation => {
        if (breweryLocation[0].name) {
          brewery.location = {
            latitude: parseFloat(breweryLocation[0].lat),
            longitude: parseFloat(breweryLocation[0].lng)
          };

          resolve(brewery);
          // if location is not populated, obtain using geocoder
        } else {
          let address: string =
            brewery.street + ' ' + brewery.city + ', ' + brewery.state;

          this.geocodingProvider.forwardGeocode(address).then(location => {
            brewery.location = {
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude)
            };

            resolve(brewery);
          });
        }
      });
    });
  }

  // add a distance from the user to the BeerSpot
  private addBreweryDistance(brewery: BeerSpot): Promise<BeerSpot> {
    return new Promise(resolve => {
      let startLatLng = this.mapsProvider.getCenter();

      let endLatLng = new google.maps.LatLng(
        brewery.location.latitude,
        brewery.location.longitude
      );

      // calculate the distance
      brewery.distance = google.maps.geometry.spherical.computeDistanceBetween(
        startLatLng,
        endLatLng
      );

      resolve(brewery);
    });
  }
}
