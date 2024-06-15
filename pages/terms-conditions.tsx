import React from 'react'
import { GetStaticProps, NextPage } from 'next'
import { IGlobalLayoutProps } from './_app'
import { DesktopView, MobileView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import BackTitle from '../components/BackTitle'
import EscapeHTML from '../components/EscapeHTML'
import { prepareTnCPageSeo } from '../utils/seo/pages/tnc'
import body from '../public/txt/tnc.txt'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const TnCPage: NextPage<IProps> = () => {
  return (
    <div>
      <MobileView>
        <Snackbar title={'Terms & Conditions'} />
      </MobileView>

      <PageContainer>
        <div className="px-3">
          <DesktopView>
            <BackTitle title={'Terms & Conditions'} />
          </DesktopView>

          <div className="mt-4">
            {/* {tncDetail.updatedDateTime ? (
              <div className="mb-3">
                <div className="font-semibold">
                  <EscapeHTML
                    element="span"
                    html={`Date of last revision: ${new Date(tncDetail.updatedDateTime).toLocaleDateString()}`}
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
      seo: prepareTnCPageSeo(),
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

export default TnCPage
