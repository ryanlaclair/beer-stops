import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { GeocodingProvider } from '../../providers/geocoding/geocoding';
import { BreweryMappingProvider, BeerSpot } from '../../providers/brewery-mapping/brewery-mapping';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  breweries: Array<BeerSpot> = new Array();

  constructor(public navCtrl: NavController, private mapsProvider: GoogleMapsProvider, private geocodingProvider: GeocodingProvider, private breweryProvider: BreweryMappingProvider) { }

  ngOnInit() {
    this.getBreweries();
  }

  private getBreweries() {
    this.geocodingProvider.getCityState().then((cityState: any) => {
      this.getCityBreweries(cityState.city).then(() => {
        this.getStateBreweries(cityState.state);
      })
    });
  }

  private getCityBreweries(city: string): Promise<any> {
    return new Promise<any>((resolve) => {
      this.breweryProvider.getBreweriesInCity(city).subscribe((breweries: Array<BeerSpot>) => {
        breweries.forEach((brewery: BeerSpot, index: number) => {
          setTimeout(() => {
            this.breweryProvider.addBreweryLocation(brewery).then(() => {
              this.breweryProvider.addBreweryDistance(brewery).then(() => {
                this.addBrewery(brewery);
                this.mapsProvider.addMarker(brewery.location.latitude, brewery.location.longitude);
              });
            });
          }, index*300);
        });
      }, () => { }, () => {
        resolve(true);
      });
    });
  }

  private getStateBreweries(state: string): Promise<any> {
    return new Promise<any>((resolve) => {
      this.breweryProvider.getBreweriesInState(state).subscribe((breweries: Array<BeerSpot>) => {
        breweries.forEach((brewery: BeerSpot, index: number) => {
          setTimeout(() => {
            this.breweryProvider.addBreweryLocation(brewery).then(() => {
              this.breweryProvider.addBreweryDistance(brewery).then(() => {
                this.addBrewery(brewery);
                this.mapsProvider.addMarker(brewery.location.latitude, brewery.location.longitude);
              });
            });
          }, index*300); 
        });
      }, () => { }, () => {
        resolve(true);
      });
    });
  }

  private addBrewery(brewery: BeerSpot) {
    let found = this.breweries.find((b) => {
      return b.id == brewery.id;
    });

    if (!found) {
      this.breweries.push(brewery);

      this.breweries.sort((a, b) => {
        return a.distance - b.distance;
      });
    }

    console.log(brewery);
  }

}