import { Component, Input } from '@angular/core';
import { PopoverController } from 'ionic-angular';

import { BeerSpot } from '../../providers/brewery-mapping/brewery-mapping';
import { BreweryMenuPage } from '../../pages/brewery-menu/brewery-menu';

@Component({
  selector: 'brewery',
  templateUrl: 'brewery.html'
})

export class BreweryComponent {

  @Input() brewery: BeerSpot;

  constructor(private popoverCtrl: PopoverController) { }

  showBreweryMenu(event: any) {
    let breweryMenu = this.popoverCtrl.create(BreweryMenuPage, {
      brewery: this.brewery
    });

    breweryMenu.present({
      ev: event
    });
  }

}
