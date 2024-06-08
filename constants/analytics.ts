export enum AnalyticsCategoryType {
  NONE = '',
}

export enum AnalyticsEventType {
  // error
  EXCEPTION = 'exception',

  // auth
  SIGNUP = 'signup',
  LOGIN = 'login',
  LOGOUT = 'logout',

  // pwa
  PWA_INSTALL_SUCCESS = 'pwa_install_success',
  PWA_INSTALL_FAILED = 'pwa_install_failed',

  // general
  FEEDBACK = 'feedback',
}
