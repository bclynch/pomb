// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const ENV = {
  production: false,
  googleAPIKey: 'AIzaSyAa8icfucqEezbxr0iAHg5sXaY2HbyOS2E',
  flickrAPIKey: '691be9c5a38900c0249854a28a319e2c',
  apolloBaseURL: 'http://localhost:5000/api/graphql',
  apiBaseURL: 'http://localhost:5000/api',
  disqusShortname: 'packonmyback'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
