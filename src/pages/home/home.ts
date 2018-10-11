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

  breweries: Array<BeerSpot> = [];

  constructor(public navCtrl: NavController, private mapsProvider: GoogleMapsProvider, private geocodingProvider: GeocodingProvider, private breweryProvider: BreweryMappingProvider) { 
    this.geocodingProvider.getState().then((state) => {
      this.breweryProvider.getBreweriesInState(state).subscribe((breweries: any) => {
        breweries.forEach((brewery, index) => {
          setTimeout(() => {
            this.breweryProvider.addBreweryLocation(brewery);
            this.breweries.push(brewery);
          }, index*300)
        });
      });
    });
  }

}