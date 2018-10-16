# Beer Stops

Beer Stops is an Ionic 4.1.2 app that allows beer lovers to discover new breweries based on their location or a city/state search.
The app opens to the main page view, which indicates the user position, and the locations of any nearby breweries.
The markers on the map indicate the brewery location, and can be clicked to show the brewery information in the card display udner the map.
The card display can be scrolled to the side, which will pan the map to show the location of the displayed brewery.
The menu button in the bottom right corner of the card display can be pressed, and the user can choose to call the brewery, open the brewery website in a browser, or open up the navigation app of their choice to get directions to the brewery.
The search button in the top navigation bar can be clicked, and a city and state entered to perform a search for breweries in the given city.
The refresh button in the navigation bar resets the map to the user location and the breweries around the user.

### Initialize Environment

To initialize the development environment:
```
npm install --save
```

### Test

To open in browser (localhost:8100):
```
ionic serve
```
Once launched, open the developer tools, toggle the "device toolbar" and select the desired mobile device size.
After resizing, you may need to reload the page.

### Build

Android:
```
ionic cordova build android
```

iOS (untested):
```
ionic cordova build ios
```

### Run

To run, you must have the proper device emulator installed.

Android:
```
ionic cordova run android
```

iOS (untested):
```
ionic cordova run ios
```

