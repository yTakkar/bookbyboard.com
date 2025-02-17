import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getTnCPageUrl } from '../../routes'

// http://localhost:3000/terms-conditions
export const prepareTnCPageSeo = (): IAppSeoProps => {
  return {
    title: `Terms and Conditions ${appConfig.seo.titleSuffix}`,
    description: appConfig.global.app.description,
    canonical: `${appConfig.global.baseUrl}${getTnCPageUrl()}`,
    keywords: [],
  }
}
