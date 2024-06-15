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

  // update profile
  EDIT_PROFILE = 'edit_profile',
  EDIT_PROFILE_AVATAR = 'edit_profile_avatar',
  EDIT_PROFILE_USERNAME = 'edit_profile_username',

  // pwa
  PWA_INSTALL_SUCCESS = 'pwa_install_success',
  PWA_INSTALL_FAILED = 'pwa_install_failed',

  // general
  FEEDBACK = 'feedback',
}
