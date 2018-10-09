import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { BeerMappingProvider } from '../../providers/beer-mapping/beer-mapping';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  breweries: Array<any> = [
    {
      name: "Brewery 1"
    },
    {
      name: "Brewery 2"
    },
    {
      name: "Brewery 3"
    },
    {
      name: "Brewery 4"
    }
  ];

  constructor(public navCtrl: NavController, private beerProvider: BeerMappingProvider) { 
    this.beerProvider.getBreweriesInState();
  }

}