import { IAppSeoProps } from '../../../components/seo/AppSeo'
import { prepareBasePageSeo } from './home'

export const prepareOfflinePageSeo = (): IAppSeoProps => {
  return {
    ...prepareBasePageSeo(),
    noIndex: true,
    noFollow: true,
  }
}
