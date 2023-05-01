import { environment } from 'src/environments/environment';

export const CONSTANT = {
  DEFAULT_POST: {
    id: 0, id_creator: 0, index: 0, content: '', link_open_count: 0, comments: [], author: undefined,
  },
  DEFAULT_SPACE: {
    id: -1, id_creator: -1, feedID: '', title: '- no feed selected -', content_title: '- no content loaded -', id_posts: [], posts: [], view_count: 0
  },
  MAX_FILE_SIZE_MB: 10,
  DURATION_SUCCESS_NOTIF_MS: 2500,
  DURATION_WARNING_NOTIF_MS: 4000,
  onboardingFeedUUID: '0e52c0fe-fa5c-40d2-bd25-dc5d4d330fb9',
  onboardingFeedUUID2: '95c1110f-8f6e-4dd1-8e0e-c0656f6b1dc5',
  onboardingFeedUUIDex: '663292be-31b2-4dd0-a7be-b2e86479682f',
  onboardingFeedUUIDFinal: environment.onboardingFeedUUID,
  onboardingText: "Hier haben wir schon mal einen Text eingeben. Hier könntest du z.B. nach einem ersten Gespräch eure Website verlinken und dem Kunden noch mal bereitstellen. \n Hallo lieber Kunde, hier noch mal unsere Website :)",
  CORBADO_WEBPAGE: 'https://corbado.com/',
  SPACE_INDIVIDUALISIEREN: 'mailto:felix@corbado.com?subject=Space individualisieren',
  UPGRADE: 'mailto:felix@corbado.com?subject=Upgrade auf Full Plan',
  FEEDBACK_CRM: 'https://1d9gkojowh4.typeform.com/to/mA9XcIVU',
  FEEDBACK_MAIL: 'https://1d9gkojowh4.typeform.com/to/ef7kVOyO',
  FEEDBACK_PUSH: 'https://1d9gkojowh4.typeform.com/to/U5CrWCvl',
  FEEDBACK_AUTO: 'https://1d9gkojowh4.typeform.com/to/eyYcEqGn',
  ID_DIEGO_DEV: 79,
  ID_DIEGO_PROD: 176,
  ID_UMP_PROD: 219,
  MAIL_UMP_PROD: "philipp.huegel@utesch.de",
  MAIL_DIEGO_DEV: 'diego.gw@hotmail.com',
  CLOUDBRIDGE_MAILS: ['n.wandschneider@cloudbridge.eu', 'k.luber@cloudbridge.eu', 'm.hain@cloudbridge.eu'],
  corbado_EMAILS: ['felix@corbado.com', 'diego@corbado.com', 'paula@corbado.com'],
  CLOUDBRIDGE_CUSTOM_VIEW_DEV: {banner: 'https://api.development.corbado.corbado.com/files/h618NUr%2BTcM0%2Bk23OrtLMg%3D%3D/download', logo: 'http://localhost:3000/files/R18ooSD8NN4Xz7GmwJ8ydw%3D%3D/download'},
  CLOUDBRIDGE_CUSTOM_VIEW: {banner: 'https://api.corbado.corbado.com/files/mcVyagCrLicz86%2FskN3Qgw%3D%3D/download', logo: 'https://api.corbado.corbado.com/files/01BtsIv1ANmSbFzUIdYf8w%3D%3D/download'},
  // corbado_CUSTOM_VIEW_DEV: {banner: 'https://api.corbado.corbado.com/files/URJnz%2FhCuUJmbnA6%2B9jQ6A%3D%3D/download', logo: 'https://api.corbado.corbado.com/files/2UU6B4oVtT5iVw3CLcdSGA%3D%3D/download'},
  CORBADO_CUSTOM_VIEW_DEV: {banner: 'http://localhost:3000/files/URJnz%2FhCuUJmbnA6%2B9jQ6A%3D%3D/download', logo: 'http://localhost:3000/files/2UU6B4oVtT5iVw3CLcdSGA%3D%3D/download'},
  CORBADO_CUSTOM_VIEW: {banner: 'https://api.corbado.corbado.com/files/4s17detnbXQQ4zGJGoGU8A%3D%3D/download', logo: 'https://api.corbado.corbado.com/files/GPFu%2FYGtKM36t8XiXWDYew%3D%3D/download'},
  LUTZ_CUSTOM_VIEW_DEV: {banner: 'https://api.corbado.corbado.com/files/%2FSJSoReNX4H1pH2HGqfdMA%3D%3D/download', logo: 'https://api.corbado.corbado.com/files/%2BcUN94MlurFju3MXCvQKag%3D%3D/download'},
  LUTZ_CUSTOM_VIEW: {banner: 'https://api.corbado.corbado.com/files/%2FSJSoReNX4H1pH2HGqfdMA%3D%3D/download', logo: 'https://api.corbado.corbado.com/files/%2BcUN94MlurFju3MXCvQKag%3D%3D/download'},
  RASINSKI_CUSTOM_VIEW_DEV: {banner: 'https://api.corbado.corbado.com/files/OlYxvfEiSyiro1DTEWbOtQ%3D%3D/download', logo: 'https://api.corbado.corbado.com/files/BT6iME2gQmshhgBl9wJPzQ%3D%3D/download'},
  RASINSKI_CUSTOM_VIEW: {banner: 'https://api.corbado.corbado.com/files/OlYxvfEiSyiro1DTEWbOtQ%3D%3D/download', logo: 'https://api.corbado.corbado.com/files/BT6iME2gQmshhgBl9wJPzQ%3D%3D/download'}
};