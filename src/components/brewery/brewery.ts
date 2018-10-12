import { Component, Input } from '@angular/core';

import { BeerSpot } from '../../providers/brewery-mapping/brewery-mapping';

@Component({
  selector: 'brewery',
  templateUrl: 'brewery.html'
})

export class BreweryComponent {

  @Input() brewery: BeerSpot;

  constructor() { }

}
