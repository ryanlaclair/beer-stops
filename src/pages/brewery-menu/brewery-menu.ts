import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {
  LaunchNavigator,
  LaunchNavigatorOptions
} from '@ionic-native/launch-navigator';

import { BeerSpot } from '../../providers/brewery-mapping/brewery-mapping';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';

@Component({
  selector: 'page-brewery-menu',
  templateUrl: 'brewery-menu.html'
})
export class BreweryMenuPage {
  brewery: BeerSpot;

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private callNumber: CallNumber,
    private iab: InAppBrowser,
    private launchNavigator: LaunchNavigator,
    private mapsProvider: GoogleMapsProvider
  ) {
    this.brewery = this.navParams.get('brewery');
  }

  // close the popover
  close() {
    this.viewCtrl.dismiss();
  }

  // launch the native dialer if available
  call() {
    this.callNumber.callNumber(this.brewery.phone, true);
    this.close();
  }

  // open for navigation in prefered navigation app
  getDirections() {
    this.mapsProvider.getUserPosition().then(position => {
      let start: string = position.latitude + ',' + position.longitude;

      let end: string =
        this.brewery.location.latitude + ',' + this.brewery.location.longitude;

      let navigatorOptions: LaunchNavigatorOptions = {
        start: start
      };

      this.launchNavigator.navigate(end, navigatorOptions).catch(() => {
        let url: string =
          'http://www.google.com/maps/dir/?api=1&origin=' +
          start +
          '&destination=' +
          end;

        this.iab.create(url, '_blank');
      });
      this.close();
    });
  }

  // open the brewery website in browser
  visitWebsite() {
    this.iab.create('http://' + this.brewery.url, '_blank');
    this.close();
  }
}
