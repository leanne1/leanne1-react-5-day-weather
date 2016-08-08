# leanne1-react-5-day-weather

## Run up the app
- Clone this repository
- Run `npm i` and `bower i`
- Run `gulp` and `npm run webpack` (in separate tabs)
- Open the browser at `http://0.0.0.0:8824/`
- Run up tests with `gulp test`

## Code
- Convert `WeatherModel` into a non-destructive functional pipeline instead of a class - with no data mutating
- Use Redux to handle state to allow scaling the app
- Unit tests
- Remove gulp and replace with a webpack / npm solution
- Handle errors (HTTP request errors etc.)

## UI / UX
- The algorithm for calculating which description and icon to show doesn't take into account whether
the time segment is day or night, so night time icons may get shown in the day

## Features
- •C / •F toggle
- Weather by 3-hourly period (or hourly with additional API call)
- Select lists to change location
- Button to fetch latest update
- Custom styling
