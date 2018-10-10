import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MapComponent } from '../components/map/map';
import { BreweryComponent } from '../components/brewery/brewery';
import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
import { BreweryMappingProvider } from '../providers/brewery-mapping/brewery-mapping';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BreweryComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    GoogleMapsProvider,
    BreweryMappingProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
