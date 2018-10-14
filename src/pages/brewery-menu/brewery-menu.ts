import { Component, Input } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { BeerSpot } from '../../providers/brewery-mapping/brewery-mapping';

@Component({
  selector: 'page-brewery-menu',
  templateUrl: 'brewery-menu.html',
})

export class BreweryMenuPage {

  brewery: BeerSpot;

  constructor(private viewCtrl: ViewController, private navParams: NavParams) { 
    this.brewery = this.navParams.get('brewery');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  call() {
    console.log('CALL');
  }

  getDirections() {
    console.log('GET DIRECTIONS');
  }

  visitWebsite() {
    console.log('VISIT WEBSITE');
  }

}
