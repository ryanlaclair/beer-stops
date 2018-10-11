import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

@Injectable()
export class GeocodingProvider {

  constructor(private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) { }

  getState(): Promise<any> {
    return new Promise((resolve) => {
      this.geolocation.getCurrentPosition().then((position) => {
        this.reverseGeocode(position.coords.latitude, position.coords.longitude).then((result) => {
          resolve(result.administrativeArea);
        })
      });
    });
  }

  forwardGeocode(address: string): Promise<NativeGeocoderForwardResult> {
    return new Promise((resolve) => {
      this.nativeGeocoder.forwardGeocode(address).then((result) => {
        resolve(result[0]);
      }).catch((error) => {
        resolve(this.googleForwardGeocode(address));
      });
    });
  }

  reverseGeocode(latitude: number, longitude: number): Promise<NativeGeocoderReverseResult> {
    return new Promise((resolve) => {
      this.nativeGeocoder.reverseGeocode(latitude, longitude).then((result) => {
        resolve(result[0]);
      }).catch((error) => {
        resolve(this.googleReverseGeocode(latitude, longitude));
      });
    });
  }

  private googleForwardGeocode(address: string): Promise<NativeGeocoderForwardResult> {
    return new Promise((resolve, reject) => {
      let googleGeocoder = new google.maps.Geocoder();

      googleGeocoder.geocode({ address: address }, (result, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let nativeResult: NativeGeocoderForwardResult = {
            latitude: result[0].geometry.location.lat().toString(),
            longitude: result[0].geometry.location.lng().toString()
          }
          
          resolve(nativeResult);
        }
        else {
          reject(status);
        }
      });
    });
  }

  private googleReverseGeocode(latitude: number, longitude: number): Promise<NativeGeocoderReverseResult> {
    return new Promise((resolve, reject) => {
      let latLng = new google.maps.LatLng(latitude, longitude);
      let googleGeocoder = new google.maps.Geocoder();
  
      googleGeocoder.geocode({ location: latLng }, (result, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let nativeResult: NativeGeocoderReverseResult = {
            countryCode: '',	
            countryName: '',
            postalCode: '',
            administrativeArea: '',
            subAdministrativeArea: '',
            locality: '',
            subLocality: '',
            thoroughfare: '',
            subThoroughfare: ''
          }
          
          result[0].address_components.forEach((component) => {
            switch (component.types[0]) {
              case 'country': 
                nativeResult.countryCode = component.short_name;
                nativeResult.countryName = component.long_name;
                break;
              case 'postal_code':
                nativeResult.postalCode = component.short_name;
                break;
              case 'administrative_area_level_1':
                nativeResult.administrativeArea = component.short_name;
                break;
              case 'administrative_area_level_2':
                nativeResult.subAdministrativeArea = component.short_name;
                break;
              case 'locality':
                nativeResult.locality = component.short_name;
                break;
              case 'route':
                nativeResult.thoroughfare = component.short_name;
                break;
              case 'street_number':
                nativeResult.subThoroughfare = component.short_name;
                break;
            }
          });

          resolve(nativeResult);
        }
        else {
          reject(status);
        }
      });
    });
  }

}
