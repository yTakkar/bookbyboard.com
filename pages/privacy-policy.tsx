import React from 'react'
import { GetStaticProps, NextPage } from 'next'
import { IGlobalLayoutProps } from './_app'
import { DesktopView, MobileView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import BackTitle from '../components/BackTitle'
import EscapeHTML from '../components/EscapeHTML'
import { preparePrivacyPolicyPageSeo } from '../utils/seo/pages/privacyPolicy'
import body from '../public/txt/privacy-policy.txt'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const PrivacyPolicyPage: NextPage<IProps> = () => {
  return (
    <div>
      <MobileView>
        <Snackbar title={'Privacy Policy'} />
      </MobileView>

      <PageContainer>
        <div className="px-3">
          <DesktopView>
            <BackTitle title={'Privacy Policy'} />
          </DesktopView>

          <div className="mt-4">
            {/* {privacyPolicyDetail.updatedDateTime ? (
              <div className="mb-3">
                <div className="font-semibold">
                  <EscapeHTML
                    element="span"
                    html={`Date of last revision: ${new Date(
                      privacyPolicyDetail.updatedDateTime
                    ).toLocaleDateString()}`}
                  />
                </div>
              </div>
            ) : null} */}

            <div className="html-body">
              <EscapeHTML element="div" html={body} />
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
      seo: preparePrivacyPolicyPageSeo(),
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

export default PrivacyPolicyPage
