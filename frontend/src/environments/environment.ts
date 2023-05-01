// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const API_URL='http://localhost:3000/';
export const API_URL_FRONT='http://localhost:4200/';
export const environment = {
  production: false,
  development: true,
  apiUrl: API_URL,
  apiUrlFront: API_URL_FRONT,
  defaultImg: 'assets/imgs/1.jpeg',
  defaulttReverseInquiryImage:'assets/imgs/2.png',
  feedbackForm:'https://1d9gkojowh4.typeform.com/to/Q4ykeVnX',
  onboardingFeedUUID: '663292be-31b2-4dd0-a7be-b2e86479682f',
  textLength:{
    titles: 80,
    descriptions: 400
  },
  tagLimit:2,
  gTagId:"G-M3XMX992R6",
  hjid: '2671135',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
