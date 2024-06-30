import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getAboutPageUrl } from '../../routes'

// http://localhost:3000/about
export const prepareAboutPageSeo = (): IAppSeoProps => {
  return {
    title: `About Us | BookByBoard - Discover Your Next Great Read`,
    description: `Discover BookByBoard, your trusted platform for monthly curated book recommendations. Learn about our mission, meet our jury of book enthusiasts, and join our community to find your next favorite book.`,
    canonical: `${appConfig.global.baseUrl}${getAboutPageUrl()}`,
    keywords: [],
  }
}
