import { Component, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

import { GeocodingProvider } from '../../providers/geocoding/geocoding';
import {
  BreweryMappingProvider,
  BeerSpot
} from '../../providers/brewery-mapping/brewery-mapping';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import {
  NativeGeocoderForwardResult,
  NativeGeocoderReverseResult
} from '@ionic-native/native-geocoder';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides)
  slides: Slides;

  showSearch: boolean = false;
  searchTerms: string;

  currentCity: string;
  currentState: string;

  breweries: Array<BeerSpot> = new Array();

  constructor(
    private geocodingProvider: GeocodingProvider,
    private breweryProvider: BreweryMappingProvider,
    private mapsProvider: GoogleMapsProvider
  ) {}

  ngOnInit() {
    this.getLocalBreweries();
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
    let index = this.slides.getActiveIndex();

    if (index < this.breweries.length) {
      let brewery = this.breweries[this.slides.getActiveIndex()];

      this.mapsProvider.showMarker(brewery.id);
    }
  }

  // toggle the boolean to show the search bar
  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  // perform a search
  search() {
    this.toggleSearch();

    this.geocodingProvider
      .forwardGeocode(this.searchTerms)
      .then((forwardResult: NativeGeocoderForwardResult) => {
        this.mapsProvider.addCenter(
          parseFloat(forwardResult.latitude),
          parseFloat(forwardResult.longitude)
        );

        this.geocodingProvider
          .reverseGeocode(
            parseFloat(forwardResult.latitude),
            parseFloat(forwardResult.longitude)
          )
          .then((reverseResult: NativeGeocoderReverseResult) => {
            this.currentCity = reverseResult.locality;
            this.currentState = reverseResult.administrativeArea;

            this.slides.slideTo(0);
            this.mapsProvider.drawMap();
            this.breweries = new Array();

            this.getBreweriesInCity();
          });
      });

    this.searchTerms = '';
  }

  // cancel the search
  cancelSearch() {
    this.toggleSearch();
    this.searchTerms = '';
  }

  // return the the first slide, redraw map and get new list of breweries
  refresh() {
    this.slides.slideTo(0);

    this.mapsProvider.addUserLocation().then(() => {
      this.mapsProvider.drawMap();

      this.breweries = new Array();
      this.getLocalBreweries();
    });
  }

  // get the list of breweries
  private getLocalBreweries() {
    this.geocodingProvider.getCityState().then((cityState: any) => {
      this.currentCity = cityState.city;
      this.currentState = cityState.state;

      this.getBreweries();
    });
  }

  private getBreweries() {
    // first get the breweries in the user city
    this.getBreweriesInCity();

    // next get the breweries in the user state
    this.getBreweriesInState();
  }

  private getBreweriesInCity() {
    this.breweryProvider
      .getBreweriesInCity(this.currentCity)
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
  }

  private getBreweriesInState() {
    this.breweryProvider
      .getBreweriesInState(this.currentState)
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
