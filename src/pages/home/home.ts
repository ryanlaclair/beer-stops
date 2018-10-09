import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController) { }

}