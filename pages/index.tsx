/* eslint-disable react/no-unescaped-entities */
import React, { useContext } from 'react'
import { IGlobalLayoutProps } from './_app'
import { GetStaticProps, NextPage } from 'next'
import { prepareHomePageSeo } from '../utils/seo/pages/home'
import PageContainer from '../components/PageContainer'
import ApplicationContext from '../components/ApplicationContext'
import { useRouter } from 'next/router'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const Home: NextPage<IProps> = () => {
  const applicationContext = useContext(ApplicationContext)
  const { user, methods } = applicationContext

  const router = useRouter()

  const loggedIn = !!user

  return (
    <PageContainer>
      <div className=""></div>
    </PageContainer>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  return {
    props: {
      pageData: {},
      seo: prepareHomePageSeo(),
      layoutData: {
        header: {},
        footer: {
          show: true,
        },
      },
      analytics: null,
      ads: {
        stickyBanner: {
          show: {
            desktop: false,
            mobile: false,
          },
        },
      },
    },
  }
}

export default Home
