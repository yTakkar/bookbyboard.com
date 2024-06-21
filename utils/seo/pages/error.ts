import { IAppSeoProps } from '../../../components/seo/AppSeo'
import { prepareBasePageSeo } from './home'

export const prepareErrorPageSeo = (): IAppSeoProps => {
  return {
    ...prepareBasePageSeo(),
    noIndex: true,
    noFollow: true,
  }
}

export const prepareNotFoundPageSeo = (): IAppSeoProps => {
  return {
    ...prepareBasePageSeo(),
    noIndex: true,
    noFollow: true,
  }
}
