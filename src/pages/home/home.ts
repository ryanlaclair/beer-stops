import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GeocodingProvider } from '../../providers/geocoding/geocoding';
import { BreweryMappingProvider, BeerSpot } from '../../providers/brewery-mapping/brewery-mapping';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  breweries: Array<BeerSpot> = new Array();

  constructor(public navCtrl: NavController, private geocodingProvider: GeocodingProvider, private breweryProvider: BreweryMappingProvider, private mapsProvider: GoogleMapsProvider ) { }

  ngOnInit() {
    this.getBreweries();
  }

  private getBreweries() {
    this.geocodingProvider.getCityState().then((cityState: any) => {
      this.breweryProvider.getBreweriesInCity(cityState.city).subscribe((cityBrewery: BeerSpot) => {
        this.addBrewery(cityBrewery);

        this.mapsProvider.addMarker(cityBrewery.location.latitude, cityBrewery.location.longitude);
      });

      this.breweryProvider.getBreweriesInState(cityState.state).subscribe((stateBrewery: BeerSpot) => {
        this.addBrewery(stateBrewery);

        this.mapsProvider.addMarker(stateBrewery.location.latitude, stateBrewery.location.longitude);
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
  }

}