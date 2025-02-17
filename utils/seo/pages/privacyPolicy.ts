import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getPrivacyPageUrl } from '../../routes'

// http://localhost:3000/privacy-policy
export const preparePrivacyPolicyPageSeo = (): IAppSeoProps => {
  return {
    title: `Privacy Policy ${appConfig.seo.titleSuffix}`,
    description: appConfig.global.app.description,
    canonical: `${appConfig.global.baseUrl}${getPrivacyPageUrl()}`,
    keywords: [],
  }
}
