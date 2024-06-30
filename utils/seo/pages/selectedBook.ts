import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { INominationDetail, INominationSuggestion } from '../../../interface/nomination'
import { getMonthNameFromId, getMonthYearIndexFromId } from '../../nomination'
import { getHomePageUrl } from '../../routes'

export const prepareSelectedBookPageSeo = (nomination: INominationDetail): IAppSeoProps => {
  const selectedSuggestion = nomination?.suggestions.find(
    s => s.boardMemberEmail === nomination.selectedBook?.boardMemberEmail
  ) as INominationSuggestion

  const { book } = selectedSuggestion

  const monthName = getMonthNameFromId(nomination!.id)
  const { year } = getMonthYearIndexFromId(nomination.id)

  return {
    title: `${book.title} by ${book.authors.join(', ')} - the selected book for ${monthName} ${year} on ${
      appConfig.global.app.name
    }`,
    description: `The selected book for ${monthName} ${year} is ${book.title} by ${book.authors.join(
      ', '
    )}. Read the book summary, nomination details, and more on ${appConfig.global.app.name}.`,
    canonical: `${appConfig.global.baseUrl}${getHomePageUrl()}`,
    keywords: [`selected book of ${monthName} ${year}`, book.title, book.authors.join(', ')],
    imageUrl: book.imageUrls.thumbnail,
  }
}
