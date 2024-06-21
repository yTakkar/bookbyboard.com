import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { INominationDetail } from '../../../interface/nomination'
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
  return {
    title: `${appConfig.global.app.title}`,
    description: appConfig.global.app.description,
    canonical: `${appConfig.global.baseUrl}${getHomePageUrl()}`,
    keywords: [],
  }
}
