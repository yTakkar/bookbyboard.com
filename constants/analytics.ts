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

  BOARD_MEMBER_REQUEST = 'board_member_request',

  // update profile
  EDIT_PROFILE = 'edit_profile',
  EDIT_PROFILE_AVATAR = 'edit_profile_avatar',
  EDIT_PROFILE_USERNAME = 'edit_profile_username',

  // pwa
  PWA_INSTALL_SUCCESS = 'pwa_install_success',
  PWA_INSTALL_FAILED = 'pwa_install_failed',

  // nomination
  NOMINATION_ADD = 'nomination_add',
  NOMINATION_UPDATE = 'nomination_update',

  // vote
  VOTE = 'vote',

  // book select
  BOOK_SELECT = 'book_select',

  SELECTED_BOOK_COPY_URL = 'selected_book_copy_url',

  // general
  FEEDBACK = 'feedback',
}
