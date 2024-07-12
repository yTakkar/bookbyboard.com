import React from 'react'
import { GetStaticProps, NextPage } from 'next'
import { IGlobalLayoutProps } from './_app'
import PageContainer from '../components/PageContainer'
import { prepareMemberRequestPageSeo } from '../utils/seo/pages/member'
import CoreImage, { ImageSourceType } from '../components/core/CoreImage'
import appConfig from '../config/appConfig'
import CoreLink from '../components/core/CoreLink'
import { prepareImageUrl } from '../utils/image'
import classNames from 'classnames'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import appAnalytics from '../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../constants/analytics'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const PrivacyPolicyPage: NextPage<IProps> = () => {
  return (
    <div>
      <PageContainer>
        <div className="px-3">
          <div className={classNames('p-5 flex flex-col items-center justify-center')}>
            <div>
              <CoreImage
                url={prepareImageUrl('/images/empty/empty-art.png', ImageSourceType.ASSET)}
                className={classNames('w-full lg:w-[700px]')}
                alt="Become a board member"
              />
            </div>
            <div className="text-center mt-2 font-semibold text-lg flex items-center">
              {`Become a board member`} <BadgeCheckIcon className="w-5 ml-1" />
            </div>
            <div className="text-center mt-2">
              {appConfig.global.app.name} is a private group of book experts who nominate and vote on the best books
              monthly. If you are interested in becoming a board member,{' '}
              <CoreLink
                url={appConfig.feedback.boardMemberRequestForm}
                isExternal
                className="border-b border-b-brand-primary"
                onClick={() => {
                  appAnalytics.sendEvent({
                    action: AnalyticsEventType.BOARD_MEMBER_REQUEST,
                  })
                }}>
                please fill this form <ExternalLinkIcon className="w-4 inline-block" />
              </CoreLink>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  return {
    props: {
      pageData: {},
      seo: prepareMemberRequestPageSeo(),
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
  }
}

export default PrivacyPolicyPage
