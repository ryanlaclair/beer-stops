import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { CallNumber } from '@ionic-native/call-number';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MapComponent } from '../components/map/map';
import { BreweryComponent } from '../components/brewery/brewery';
import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
import { BreweryMappingProvider } from '../providers/brewery-mapping/brewery-mapping';
import { GeocodingProvider } from '../providers/geocoding/geocoding';
import { BreweryMenuPage } from '../pages/brewery-menu/brewery-menu';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BreweryMenuPage,
    BreweryComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage, BreweryMenuPage],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    NativeGeocoder,
    CallNumber,
    InAppBrowser,
    LaunchNavigator,
    GoogleMapsProvider,
    BreweryMappingProvider,
    GeocodingProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
