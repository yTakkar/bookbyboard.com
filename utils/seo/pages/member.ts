import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { IBoardMemberInfo } from '../../../interface/boardMember'
import { getMemberEditPageUrl, getMemberPageUrl } from '../../routes'

export const prepareMemberPageSeo = (memberInfo: IBoardMemberInfo): IAppSeoProps => {
  const title = `${memberInfo.name} (@${memberInfo.username}) ${appConfig.seo.titleSuffix}`
  const socialTitle = title

  // const description = `${lists.length} recommendation lists by ${memberInfo.name} on ${appConfig.global.app.name}`
  // const socialDescription = `Check out ${lists.length} recommendation lists by ${memberInfo.name} on ${appConfig.global.app.name}`

  const description = `${memberInfo.name}'s profile on ${appConfig.global.app.name}`
  const socialDescription = `Check out ${memberInfo.name}'s profile on ${appConfig.global.app.name}`

  return {
    title,
    description,
    canonical: `${appConfig.global.baseUrl}${getMemberPageUrl(memberInfo.username)}`,
    keywords: [memberInfo.name, memberInfo.username],
    openGraph: {
      title: socialTitle,
      description: socialDescription,
    },
    twitter: {
      title: socialTitle,
      description: socialDescription,
    },
  }
}

export const prepareMemberEditPageSeo = (): IAppSeoProps => {
  return {
    title: `Edit profile ${appConfig.seo.titleSuffix}`,
    description: `Edit your profile on ${appConfig.global.app.name}`,
    canonical: `${appConfig.global.baseUrl}${getMemberEditPageUrl()}`,
    keywords: [],
    noFollow: true,
    noIndex: true,
  }
}
