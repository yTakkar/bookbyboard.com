import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
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

export const prepareHomePageSeo = (nomination: INominationDetail): IAppSeoProps => {
  const selectedSuggestion = nomination?.suggestions.find(
    s => s.boardMemberEmail === nomination.selectedBook?.boardMemberEmail
  ) as INominationSuggestion

  const { book } = selectedSuggestion

  return {
    title: `${book.title} - Book of the Month | ${appConfig.global.app.name}`,
    description: `Discover ${book.title}, the book of the month on BookByBoard, nominated by our board members. Learn why this book was chosen and join our community of passionate readers.`,
    canonical: `${appConfig.global.baseUrl}${getHomePageUrl()}`,
    keywords: [book.title, (book.authors || []).join(', ')],
    imageUrl: enlargeBookImage(book.imageUrls.thumbnail, BookZoomType.MEDIUM),
  }
}
