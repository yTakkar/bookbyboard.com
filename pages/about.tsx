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
                <span className="font-bold mb-1 block">BookByBoard</span>
                {`Our mission is simple: to make it easier for readers to discover books that they might not find otherwise.`}
              </p>

              <p>
                <span className="font-bold mb-1 block">Why Us?</span>
                {`Our book selections are not algorithm-driven but are carefully curated by real people who love books just as much as you do.`}
              </p>

              <p>
                <span className="font-bold mb-1 block">How It Works?</span>
                {`Every month, our board members, who are book enthusiasts nominate their favorite books. These nominations are then put to a vote. The book with the most votes becomes our "Book of the Month," which we feature prominently on our platform.`}
              </p>

              <p>
                <span className="font-bold mb-1 block">Contact Us</span>
                {`Please don't hesitate to `}
                <CoreLink url={`mailto:${mail}`} isExternal>
                  reach out
                </CoreLink>
                {` if you have any questions or feedback. We would love to hear from you and are just an email away!`}
              </p>

              {/* <CoreDivider className="my-8" />

              <p className="flex items-center">
                ~ A weekend project by
                <CoreLink url={appConfig.team.faiyaz} className="flex items-center underline" isExternal>
                  <CoreImage url={'/images/team/faiyaz.jpeg'} alt="Faiyaz" className="w-5 mr-1 ml-2 rounded-full" />
                  <span className="font-bold leading-4">Faiyaz</span>
                </CoreLink>
                <CoreLink url={appConfig.team.dhanvi} className="flex items-center underline" isExternal>
                  <CoreImage url={'/images/team/dhanvi.jpeg'} alt="Dhanvi" className="w-5 mr-1 ml-2 rounded-full" />
                  <span className="font-bold leading-4">Dhanvi</span>
                </CoreLink>
              </p> */}
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
