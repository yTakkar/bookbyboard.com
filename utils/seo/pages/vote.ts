import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getNominationPageUrl } from '../../routes'

// http://localhost:3000/nomination
export const prepareNominationPageSeo = (): IAppSeoProps => {
  return {
    title: `Nomination ${appConfig.seo.titleSuffix}`,
    description: `Nomination ${appConfig.seo.titleSuffix}`,
    canonical: `${appConfig.global.baseUrl}${getNominationPageUrl()}`,
    keywords: [],
  }
}
