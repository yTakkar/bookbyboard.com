export const getHomePageUrl = () => {
  return '/'
}

export const getMorePageUrl = () => {
  return '/more'
}

export const getPrivacyPageUrl = () => {
  return '/privacy-policy'
}

export const getTnCPageUrl = () => {
  return '/terms-conditions'
}

export const getAboutPageUrl = () => {
  return '/about'
}

export const get404PageUrl = () => {
  return '/not-found'
}

export const getMemberPageUrl = (username: string) => {
  return `/member/${username}`
}

export const getMemberEditPageUrl = () => {
  return `/member/edit`
}

export const getNominationPageUrl = () => {
  return '/nomination'
}

export const getSelectedBookPageUrl = (month: number, year: number) => {
  return `/selected-book/${month}-${year}`
}
