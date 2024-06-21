import { IAppSeoProps } from '../../../components/seo/AppSeo'
import { prepareBasePageSeo } from './home'

// http://localhost:3000/more
export const prepareMorePageSeo = (): IAppSeoProps => {
  return {
    ...prepareBasePageSeo(),
    noIndex: true,
    noFollow: true,
  }
}
