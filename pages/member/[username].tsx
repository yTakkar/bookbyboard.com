/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext } from 'react'
import { IGlobalLayoutProps } from '../_app'
import PageContainer from '../../components/PageContainer'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { getBoardMemberByUsername, listBoardMembers } from '../../firebase/store/boardMember'
import { get404PageUrl, getMemberEditPageUrl } from '../../utils/routes'
import { INITIAL_PAGE_BUILD_COUNT, PAGE_REVALIDATE_TIME, SOCIAL_ICONS_SRC_MAP } from '../../constants/constants'
import CoreImage from '../../components/core/CoreImage'
import appConfig from '../../config/appConfig'
import ApplicationContext from '../../components/ApplicationContext'
import { useRouter } from 'next/router'
import PageLoader from '../../components/loader/PageLoader'
import classNames from 'classnames'
import { isAdminUser, withHttp } from '../../utils/common'
import useScrollToTop from '../../hooks/useScrollToTop'
import CoreLink from '../../components/core/CoreLink'
import { IBoardMemberInfo } from '../../interface/boardMember'
import { prepareMemberPageSeo } from '../../utils/seo/pages/member'
import NominationBanner from '../../components/nominate/NominateBanner'
import NoContent from '../../components/NoContent'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    memberInfo: IBoardMemberInfo
  }
}

const ProfilePage: NextPage<IProps> = (props: IProps) => {
  const router = useRouter()

  if (router.isFallback || !props.pageData) {
    return <PageLoader />
  }

  const {
    pageData: { memberInfo },
  } = props

  const applicationContext = useContext(ApplicationContext)
  const { boardMember } = applicationContext

  useScrollToTop()

  const DEFAULT_BIO = 'This bio is super empty at the moment.'

  const socialLinks = [
    {
      url: memberInfo.websiteUrl ? withHttp(memberInfo.websiteUrl) : null,
      name: 'Website',
      iconSrc: SOCIAL_ICONS_SRC_MAP.GLOBE,
      show: !!memberInfo.websiteUrl,
    },
    {
      url: `https://instagram.com/${memberInfo.socialUsernames.instagram}`,
      name: 'Instagram',
      iconSrc: SOCIAL_ICONS_SRC_MAP.INSTAGRAM,
      show: !!memberInfo.socialUsernames.instagram,
    },
    {
      url: `https://x.com/${memberInfo.socialUsernames.twitter}`,
      name: 'Twitter',
      iconSrc: SOCIAL_ICONS_SRC_MAP.TWITTER,
      show: !!memberInfo.socialUsernames.twitter,
    },
    {
      url: `https://www.youtube.com/@${memberInfo.socialUsernames.instagram}`,
      name: 'YouTube',
      iconSrc: SOCIAL_ICONS_SRC_MAP.YOUTUBE,
      show: !!memberInfo.socialUsernames.youtube,
    },
  ]

  const socialLinksToShow = socialLinks.filter(socialLink => socialLink.show)

  const currentUserProfile = memberInfo.username === boardMember?.username

  return (
    <PageContainer>
      <NominationBanner />

      <div className="p-4 py-6">
        <div className="bg-white flex flex-col justify-center items-center lg:flex-row lg:justify-normal">
          <div
            onClick={() => {
              if (currentUserProfile) {
                router.push(getMemberEditPageUrl())
              }
            }}
            title="Edit">
            <CoreImage
              url={memberInfo.avatarUrl!}
              alt={`${memberInfo.name}'s profile on ${appConfig.global.app.name}`}
              className={classNames('w-40 h-40 rounded-full', {
                'cursor-pointer': currentUserProfile,
              })}
            />
          </div>

          <div className="text-center lg:text-left lg:ml-8">
            <div className="flex flex-col items-center mt-4 lg:flex-row lg:mt-0">
              <div className="font-domaine-bold font-bold text-3xl tracking-wide lg:text-4xl">{memberInfo.name}</div>
              {isAdminUser(memberInfo.email) && !currentUserProfile ? (
                <span className="ml-2 bg-gallery text-xxs px-1 py-[2px] rounded-sm">Admin</span>
              ) : null}
              {currentUserProfile && (
                <div
                  className="bg-gallery text-xxs px-1 py-[2px] rounded-sm mt-3 lg:ml-2 cursor-pointer"
                  onClick={() => {
                    router.push(getMemberEditPageUrl())
                  }}>
                  Edit profile
                </div>
              )}
            </div>
            <div className="mt-4 lg:mt-1">@{memberInfo.username}</div>
            <div className="text-gray-500 mt-4">{memberInfo.bio || DEFAULT_BIO}</div>

            {socialLinksToShow.length > 0 && (
              <div className="flex justify-center items-center mt-4 lg:items-start lg:justify-normal">
                {socialLinksToShow.map(socialLink => {
                  return (
                    <CoreLink
                      key={socialLink.name}
                      url={socialLink.url}
                      isExternal
                      className="w-5 mr-3 transform transition-transform hover:scale-110"
                      title={`${socialLink.name}`}>
                      <CoreImage url={socialLink.iconSrc} alt={socialLink.name} useTransparentPlaceholder />
                    </CoreLink>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <NoContent
            message={`Books nominated by ${memberInfo.name} will appear here soon.`}
            imageClassName="w-full lg:w-[700px]"
          />
        </div>
      </div>
    </PageContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const boardMembers = await listBoardMembers({
    limit: INITIAL_PAGE_BUILD_COUNT.MEMBER,
  })

  const paths: any = boardMembers.map(user => ({
    params: {
      username: user.username,
    },
  }))

  return {
    paths: paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const params = context.params as any

  const memberInfo = await getBoardMemberByUsername(params.username)

  if (!memberInfo) {
    return {
      redirect: {
        destination: get404PageUrl(),
        permanent: false,
      },
    }
  }

  return {
    props: {
      pageData: {
        memberInfo: memberInfo,
      },
      seo: prepareMemberPageSeo(memberInfo),
      layoutData: {
        header: {
          hideTopNav: {
            desktop: false,
            mobile: false,
          },
        },
        footer: {
          show: true,
        },
      },
      analytics: null,
      ads: {
        stickyBanner: {
          show: {
            desktop: true,
            mobile: true,
          },
        },
      },
    },
    revalidate: PAGE_REVALIDATE_TIME.MEMBER,
  }
}

export default ProfilePage
