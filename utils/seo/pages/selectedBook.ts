import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { BookZoomType } from '../../../interface/book'
import { INominationDetail, INominationSuggestion } from '../../../interface/nomination'
import { enlargeBookImage } from '../../book'
import { getMonthNameFromId, getMonthYearIndexFromId } from '../../nomination'
import { getSelectedBookPageUrl } from '../../routes'

export const prepareSelectedBookPageSeo = (nominationId: string, nomination: INominationDetail): IAppSeoProps => {
  const monthName = getMonthNameFromId(nominationId)
  const { year } = getMonthYearIndexFromId(nominationId)

  if (!nomination?.selectedBook) {
    return {
      title: `Book of the Month for ${monthName} ${year} on ${appConfig.global.app.name}`,
      description: appConfig.global.app.description,
      canonical: `${appConfig.global.baseUrl}${getSelectedBookPageUrl(nominationId)}`,
      keywords: [`book of the month for ${monthName} ${year}`],
    }
  }

  const selectedSuggestion = nomination?.suggestions.find(
    s => s.boardMemberEmail === nomination.selectedBook?.boardMemberEmail
  ) as INominationSuggestion

  const { book } = selectedSuggestion

  return {
    title: `${book.title} by ${book.authors.join(', ')} - book of the month for ${monthName} ${year} on ${
      appConfig.global.app.name
    }`,
    description: `The book of the month for ${monthName} ${year} is ${book.title} by ${book.authors.join(
      ', '
    )}. Read the book summary, nomination details, and more on ${appConfig.global.app.name}.`,
    canonical: `${appConfig.global.baseUrl}${getSelectedBookPageUrl(nominationId)}`,
    keywords: [`book of the month for ${monthName} ${year}`, book.title, book.authors.join(', ')],
    imageUrl: enlargeBookImage(book.imageUrls.thumbnail, BookZoomType.MEDIUM),
  }
}
