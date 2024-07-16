import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { APP_LOGO } from '../../../constants/constants'
import { BookZoomType } from '../../../interface/book'
import { INominationDetail, INominationSuggestion } from '../../../interface/nomination'
import { enlargeBookImage } from '../../book'
import { getHomePageUrl } from '../../routes'

export const prepareBasePageSeo = (): IAppSeoProps => {
  return {
    title: `${appConfig.global.app.title}`,
    description: appConfig.global.app.description,
    canonical: `${appConfig.global.baseUrl}${getHomePageUrl()}`,
    keywords: [],
  }
}

export const prepareHomePageSeo = (nomination: INominationDetail | undefined): IAppSeoProps => {
  if (!nomination?.selectedBook) {
    return prepareBasePageSeo()
  }

  const selectedSuggestion = nomination?.suggestions.find(
    s => s.boardMemberEmail === nomination.selectedBook?.boardMemberEmail
  ) as INominationSuggestion

  const { book } = selectedSuggestion

  return {
    title: `${book.title} - Book of the Month | ${appConfig.global.app.name}`,
    description: appConfig.global.app.description,
    canonical: `${appConfig.global.baseUrl}${getHomePageUrl()}`,
    keywords: [book.title, (book.authors || []).join(', ')],
    imageUrl: enlargeBookImage(book.imageUrls.thumbnail, BookZoomType.MEDIUM) || APP_LOGO.DEFAULT_WHITE,
  }
}
