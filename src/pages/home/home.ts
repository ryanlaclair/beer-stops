import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';

import { GeocodingProvider } from '../../providers/geocoding/geocoding';
import {
  BreweryMappingProvider,
  BeerSpot
} from '../../providers/brewery-mapping/brewery-mapping';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides)
  slides: Slides;

  breweries: Array<BeerSpot> = new Array();

  constructor(
    public navCtrl: NavController,
    private geocodingProvider: GeocodingProvider,
    private breweryProvider: BreweryMappingProvider,
    private mapsProvider: GoogleMapsProvider
  ) {}

  ngOnInit() {
    this.getBreweries();
  }

  // update slider when the user clicks a marker
  handleMarkerClick(id: number) {
    let index = this.breweries.indexOf(
      this.breweries.find(b => {
        return b.id == id;
      })
    );

    this.slides.slideTo(index);
  }

  // update map when the user slides the slider
  handleSlideChange() {
    let brewery = this.breweries[this.slides.getActiveIndex()];

    this.mapsProvider.showMarker(brewery.id);
  }

  // return the the first slide, redraw map and get new list of breweries
  refresh() {
    this.slides.slideTo(0);

    this.mapsProvider.drawMap();

    this.breweries = new Array();
    this.getBreweries();
  }

  // get the list of breweries
  private getBreweries() {
    this.geocodingProvider.getCityState().then((cityState: any) => {
      // first get the breweries in the user city
      this.breweryProvider
        .getBreweriesInCity(cityState.city)
        .subscribe((cityBrewery: BeerSpot) => {
          if (this.addBrewery(cityBrewery)) {
            this.mapsProvider.addMarker(
              cityBrewery.location.latitude,
              cityBrewery.location.longitude,
              cityBrewery.id,
              this.handleMarkerClick.bind(this)
            );
          }
        });

      // next get the breweries in the user state
      this.breweryProvider
        .getBreweriesInState(cityState.state)
        .subscribe((stateBrewery: BeerSpot) => {
          if (this.addBrewery(stateBrewery)) {
            this.mapsProvider.addMarker(
              stateBrewery.location.latitude,
              stateBrewery.location.longitude,
              stateBrewery.id,
              this.handleMarkerClick.bind(this)
            );
          }
        });
    });
  }

  // add a brewery to the display if it doesn't already exist
  private addBrewery(brewery: BeerSpot) {
    let found = this.breweries.find(b => {
      return b.id == brewery.id;
    });

    if (!found) {
      this.breweries.push(brewery);

      this.breweries.sort((a, b) => {
        return a.distance - b.distance;
      });

      return true;
    } else {
      return false;
    }
  }
}
