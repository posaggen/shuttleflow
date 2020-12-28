import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhShuttleIn from './zh/shuttle-in.json'
import zhShuttleOut from './zh/shuttle-out.json'
import zhCommon from './zh/common.json'
import zhTokenTrans from './zh/token.json'
//market and translation
import zhMHTrans from './zh/history-market.json'
import zhNavTrans from './zh/nav.json'
import zhCaptionTrans from './zh/caption.json'

import enShuttleIn from './en/shuttle-in.json'
import enShuttleOut from './en/shuttle-out.json'
import enCommon from './en/common.json'
import enTokenTrans from './en/token.json'
import enMHTrans from './en/history-market.json'
import enNavTrans from './en/nav.json'
import enCaptionTrans from './en/caption.json'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        'shuttle-in': enShuttleIn,
        'shuttle-out': enShuttleOut,
        common: enCommon,
        market: enMHTrans,
        history: enMHTrans,
        nav: enNavTrans,
        token: enTokenTrans,
        caption: enCaptionTrans,
      },
      zh: {
        'shuttle-in': zhShuttleIn,
        'shuttle-out': zhShuttleOut,
        common: zhCommon,
        market: zhMHTrans,
        history: zhMHTrans,
        nav: zhNavTrans,
        token: zhTokenTrans,
        caption: zhCaptionTrans,
      },
    },
    react: {
      nsMode: 'fallback',
      defaultTransParent: 'div', // a valid react element - required before react 16
      transEmptyNodeValue: '', // what to return for empty Trans
      transSupportBasicHtmlNodes: true, // allow <br/> and simple html elements in translations
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'], // don't convert to <1></1> if simple react elements
    },
    lng: 'zh',
    fallbackLng: 'zh',
    fallbackNS: ['nav', 'common'],
    // debug: true,

    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
