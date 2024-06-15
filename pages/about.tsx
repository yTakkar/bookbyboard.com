import React from 'react'
import { GetStaticProps, NextPage } from 'next'
import { IGlobalLayoutProps } from './_app'
import { DesktopView, MobileView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import BackTitle from '../components/BackTitle'
import { prepareAboutPageSeo } from '../utils/seo/pages/about'
import CoreImage from '../components/core/CoreImage'
import CoreLink from '../components/core/CoreLink'
import CoreDivider from '../components/core/CoreDivider'
import appConfig from '../config/appConfig'
import useScrollToTop from '../hooks/useScrollToTop'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const AboutPage: NextPage<IProps> = () => {
  useScrollToTop()

  const mail = appConfig.company.contactEmail

  return (
    <div>
      <MobileView>
        <Snackbar title={'About Us'} />
      </MobileView>

      <PageContainer>
        <div className="px-3">
          <DesktopView>
            <BackTitle title={'About Us'} />
          </DesktopView>

          <div className="mt-4">
            <div className="html-body">
              <p>
                {`In the closing months of 2022, a simple idea led to the creation of MyLikes. I wanted to share my
                classical music playlist with friends, giving them a chance to engage with it, and most importantly, to
                track how each recommendation performed.`}
              </p>

              <p>
                {`Please don't hesitate to `}
                <CoreLink url={`mailto:${mail}`} isExternal>
                  reach out
                </CoreLink>
                {` if you have any questions or feedback. We would love to hear from you and are just an email away!`}
              </p>
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
      seo: prepareAboutPageSeo(),
      layoutData: {
        header: {
          hideTopNav: {
            desktop: false,
            mobile: true,
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

export default AboutPage
