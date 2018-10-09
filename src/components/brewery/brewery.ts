import { Component, Input } from '@angular/core';

@Component({
  selector: 'brewery',
  templateUrl: 'brewery.html'
})

export class BreweryComponent {

  @Input() name: string;

  constructor() { }

}
