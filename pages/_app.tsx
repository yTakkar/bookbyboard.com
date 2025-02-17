import React, { useEffect, useState } from 'react'
import 'styles/styles.scss'
import { NextPage } from 'next'
import ApplicationContext from '../components/ApplicationContext'
import { Router, useRouter } from 'next/router'
import appConfig from '../config/appConfig'
import useApplicationContext from '../hooks/useApplicationContext'
import classnames from 'classnames'
import { DynamicPageTransition } from '../components/dynamicComponents'
import ErrorBoundary from '../components/error/ErrorBoundary'
import AppSeo, { IAppSeoProps } from '../components/seo/AppSeo'
import classNames from 'classnames'
import Header from '../components/header/Header'
import CookieBanner from '../components/CookieBanner'
import Toaster from '../components/Toaster'
import OrientationLock from '../components/OrientationLock'
import PopupRenderer from '../components/popup/PopupRenderer'
import { dynamicNprogress } from '../components/dynamicModules'
import { Analytics } from '@vercel/analytics/react'
import appAnalytics from '../lib/analytics/appAnalytics'
import Footer from '../components/footer/Footer'

Router.events.on('routeChangeStart', () => {
  dynamicNprogress().then(mod => mod.start())
})

Router.events.on('routeChangeComplete', () => {
  dynamicNprogress().then(mod => mod.done())
})

Router.events.on('routeChangeError', () => {
  dynamicNprogress().then(mod => mod.done())
})

export interface IPageLayoutData {
  header: {
    hideTopNav?: {
      mobile: boolean
      desktop: boolean
    }
  }
  footer: {
    show: boolean
  }
}

export interface IGlobalLayoutProps {
  pageData: any
  seo: IAppSeoProps
  layoutData: IPageLayoutData
  analytics: any
}

interface IProps {
  Component: NextPage<IGlobalLayoutProps>
  pageProps: IGlobalLayoutProps
}

const MyApp: NextPage<IProps> = props => {
  const { Component, pageProps } = props
  const { seo, layoutData } = pageProps || {}

  const { header, footer } = layoutData || {}
  const { hideTopNav } = header || {}

  const { applicationContext } = useApplicationContext()
  const router = useRouter()

  const [analyticsLoaded, toggleAnalyticsLoaded] = useState(false)

  useEffect(() => {
    appAnalytics.init().then(() => {
      toggleAnalyticsLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (analyticsLoaded) {
      window.scrollTo(0, 0)
      appAnalytics.sendPageView({
        pageTitle: router.asPath,
        pagePath: router.asPath,
      })
    }
  }, [router.asPath, analyticsLoaded])

  let showTopNav = true

  if (!hideTopNav) {
    showTopNav = true
  } else {
    if (hideTopNav.desktop && hideTopNav.mobile) {
      showTopNav = false
    } else if (hideTopNav.desktop && !hideTopNav.mobile) {
      showTopNav = !applicationContext.device.isDesktop
    } else if (!hideTopNav.desktop && hideTopNav.mobile) {
      showTopNav = !applicationContext.device.isMobile
    }
  }

  return (
    <>
      <ApplicationContext.Provider value={applicationContext}>
        <AppSeo {...seo} />
        <Header topNavVisibility={showTopNav} />

        <ErrorBoundary key={router.route}>
          <main
            id={classnames('pageMain', {
              'pageMain-lock': !appConfig.features.enableLandscapeMode,
            })}
            className={classNames('page-main lg:pb-0')}>
            {appConfig.features.enablePageTransition ? (
              <DynamicPageTransition timeout={300} classNames="pageTransition">
                <Component {...pageProps} key={router.route} />
              </DynamicPageTransition>
            ) : (
              <Component {...pageProps} key={router.route} />
            )}

            {footer?.show ? <Footer /> : null}
          </main>

          <CookieBanner />
          <Toaster />
          {/* {appConfig.features.enableScrollToTop ? <ScrollToTop /> : null} */}
          {!appConfig.features.enableLandscapeMode ? <OrientationLock /> : null}
          <PopupRenderer />
          {/* <DesktopView useCSS>
            <GeneralFeedbackFormButton />
          </DesktopView> */}

          {!appConfig.isDev && <Analytics />}
        </ErrorBoundary>
      </ApplicationContext.Provider>
    </>
  )
}

export default MyApp
